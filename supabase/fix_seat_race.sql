-- HIGH-3 fix: atomic seat assignment
-- Run this once in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- After running, the verify and mark-paid routes will call this function
-- instead of the non-atomic SELECT MAX + INSERT pattern.

CREATE OR REPLACE FUNCTION assign_seats_atomic(
  p_ticket_id  uuid,
  p_qty        integer,
  p_payment_id text,
  p_qr_token   text
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_next integer;
BEGIN
  -- Advisory lock serialises all concurrent seat assignments for this event.
  -- Released automatically at end of transaction.
  PERFORM pg_advisory_xact_lock(hashtext('tlt_seat_assignment'));

  -- Find the next available seat number, excluding the ticket being confirmed
  -- (it may already hold seat_numbers from a previous partial assignment).
  SELECT COALESCE(MAX(s), 0) + 1 INTO v_next
  FROM living_table_tickets,
       LATERAL unnest(seat_numbers) AS s
  WHERE payment_status IN ('paid', 'pending')
    AND id <> p_ticket_id;

  -- Mark paid and assign the seat block atomically
  UPDATE living_table_tickets SET
    payment_status      = 'paid',
    razorpay_payment_id = p_payment_id,
    ticket_number       = v_next,
    seat_numbers        = ARRAY(SELECT generate_series(v_next, v_next + p_qty - 1)),
    qr_token            = p_qr_token
  WHERE id = p_ticket_id;

  RETURN json_build_object(
    'ticket_number', v_next,
    'seat_numbers',  ARRAY(SELECT generate_series(v_next, v_next + p_qty - 1))
  );
END;
$$;
