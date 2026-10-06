import { NextResponse } from "next/server";
import { hashPassword, createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/dbRetry";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      password,
      role = "CLIENT",
      // provider fields (optional)
      businessName,
      bio,
      city,
      subcity,
      woreda,
      categories = [],
      pricingType = "NEGOTIABLE",
      startingPrice,
      telegram,
      whatsapp,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existing = await dbRetry(() =>
      prisma.user.findUnique({ where: { email } })
    );
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await dbRetry(() =>
      prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role,
        ...(role === "PROVIDER" && {
          provider: {
            create: {
              businessName: businessName || name,
              bio: bio || "",
              city: city || "Addis Ababa",
              subcity: subcity || null,
              woreda: woreda || null,
              pricingType,
              startingPrice: startingPrice ? Number(startingPrice) : null,
              phone: phone || null,
              telegram: telegram || null,
              whatsapp: whatsapp || null,
              categories: {
                connect: categories.map((slug: string) => ({ slug })),
              },
            },
          },
        }),
      },
    })
    );

    await createSession(user.id);

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
