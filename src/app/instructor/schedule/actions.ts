"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// All four actions rely on RLS, not a role check here: the
// assessment_locations_instructor_write / assessment_slots_instructor_write
// policies (0009_assessment_slot_booking.sql) already restrict writes to
// is_instructor() (instructor or admin), and this page is itself only
// reachable by those roles (see the layout's auth check) — so a plain
// RLS-scoped client is enough, no service-role client needed here.

export async function addLocation(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const multiplierRaw = Number(formData.get("travel_surcharge_multiplier"));
  const multiplier = Number.isFinite(multiplierRaw) && multiplierRaw >= 0 ? multiplierRaw : 0;

  if (!name) return;

  await supabase.from("assessment_locations").insert({
    name,
    address: address || null,
    travel_surcharge_multiplier: multiplier,
  });

  revalidatePath("/instructor/schedule");
}

export async function toggleLocationActive(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const currentlyActive = formData.get("active") === "true";
  if (!id) return;

  await supabase.from("assessment_locations").update({ active: !currentlyActive }).eq("id", id);
  revalidatePath("/instructor/schedule");
}

export async function addSlot(formData: FormData) {
  const supabase = await createClient();
  const locationId = String(formData.get("location_id") ?? "");
  const date = String(formData.get("assessment_date") ?? "");
  const time = String(formData.get("assessment_time") ?? "");
  const capacityRaw = Number(formData.get("capacity"));
  const capacity = Number.isFinite(capacityRaw) && capacityRaw > 0 ? capacityRaw : 8;

  if (!locationId || !date || !time) return;

  await supabase.from("assessment_slots").insert({
    location_id: locationId,
    assessment_date: date,
    assessment_time: time,
    capacity,
  });

  revalidatePath("/instructor/schedule");
}

export async function toggleSlotActive(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const currentlyActive = formData.get("active") === "true";
  if (!id) return;

  // Deliberately doesn't touch existing assessment_bookings — deactivating
  // a date only stops new bookings (it drops out of the /assessment
  // calendar). Anyone already booked in stays booked; cancelling an
  // already-booked student is a separate, deliberate action Scott should
  // take himself, not a side effect of taking a date off the calendar.
  await supabase.from("assessment_slots").update({ active: !currentlyActive }).eq("id", id);
  revalidatePath("/instructor/schedule");
}
