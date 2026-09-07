import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../_auth";

const PROFESSIONAL = "Ádria Freitas";

function cleanDates(value: unknown) {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .map((item) => String(item || "").trim())
        .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item))
    )
  );
}

export async function GET(request: NextRequest) {
  const admin = await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 401 }
    );
  }

  const [settings, availability, exceptions] = await Promise.all([
    supabaseAdmin
      .from("therapy_booking_settings")
      .select("*")
      .eq("professional", PROFESSIONAL)
      .maybeSingle(),

    supabaseAdmin
      .from("therapy_availability")
      .select("*")
      .eq("professional", PROFESSIONAL)
      .order("weekday"),

    supabaseAdmin
      .from("therapy_availability_exceptions")
      .select("*")
      .eq("professional", PROFESSIONAL)
      .order("exception_date"),
  ]);

  if (settings.error) {
    return NextResponse.json(
      { error: settings.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    settings: settings.data,
    availability: availability.data || [],
    exceptions: exceptions.data || [],
  });
}

export async function PUT(request: NextRequest) {
  const admin = await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const settings = body.settings || {};
  const availability = Array.isArray(body.availability)
    ? body.availability
    : [];

  const { error: settingsError } = await supabaseAdmin
    .from("therapy_booking_settings")
    .upsert(
      {
        professional: PROFESSIONAL,
        session_minutes: Number(settings.session_minutes) || 60,
        break_minutes: Number(settings.break_minutes) || 0,
        booking_window_days: Number(settings.booking_window_days) || 30,
        min_notice_hours: Number(settings.min_notice_hours) || 0,
        client_reschedule_enabled:
          settings.client_reschedule_enabled !== false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "professional" }
    );

  if (settingsError) {
    return NextResponse.json(
      { error: settingsError.message },
      { status: 500 }
    );
  }

  for (const day of availability) {
    const weekday = Number(day.weekday);

    if (
      !Number.isInteger(weekday) ||
      weekday < 0 ||
      weekday > 6
    ) {
      continue;
    }

    const { error } = await supabaseAdmin
      .from("therapy_availability")
      .upsert(
        {
          professional: PROFESSIONAL,
          weekday,
          enabled: Boolean(day.enabled),
          start_time: day.start_time || "09:00",
          end_time: day.end_time || "18:00",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "professional,weekday" }
      );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const admin = await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 401 }
    );
  }

  const body = await request.json();

  // NOVO: operações em lote para o calendário.
  const action = String(body.action || "").trim();
  const dates = cleanDates(body.dates);

  if (dates.length && action === "block") {
    const rows = dates.map((date) => ({
      professional: PROFESSIONAL,
      exception_date: date,
      available: false,
      start_time: null,
      end_time: null,
      note: null,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabaseAdmin
      .from("therapy_availability_exceptions")
      .upsert(rows, {
        onConflict: "professional,exception_date",
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      affected: dates.length,
    });
  }

  if (dates.length && action === "unblock") {
    const { error } = await supabaseAdmin
      .from("therapy_availability_exceptions")
      .delete()
      .eq("professional", PROFESSIONAL)
      .in("exception_date", dates);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      affected: dates.length,
    });
  }

  // Compatibilidade com a versão anterior.
  const exceptionDate = String(
    body.exception_date || ""
  ).trim();

  if (!exceptionDate) {
    return NextResponse.json(
      { error: "Informe a data." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("therapy_availability_exceptions")
    .upsert(
      {
        professional: PROFESSIONAL,
        exception_date: exceptionDate,
        available: Boolean(body.available),
        start_time: body.available
          ? body.start_time || null
          : null,
        end_time: body.available
          ? body.end_time || null
          : null,
        note: String(body.note || "").trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "professional,exception_date" }
    );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const admin = await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Acesso não autorizado." },
      { status: 401 }
    );
  }

  const date = String(
    request.nextUrl.searchParams.get("date") || ""
  ).trim();

  if (!date) {
    return NextResponse.json(
      { error: "Data não informada." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("therapy_availability_exceptions")
    .delete()
    .eq("professional", PROFESSIONAL)
    .eq("exception_date", date);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
