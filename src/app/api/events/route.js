import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { Event } from "@/database";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());

        } catch (e) {
            return NextResponse.json({ message: "Invalid JSON Data format" }, { status: 400 })
        }

        const file = formData.get('image');

        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 })

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if (error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        event.image = uploadResult.secure_url
        const createdEvent = await Event.create(event);


        return NextResponse.json({ message: "Event created succesfully", event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Event Creation Failed", error: e instanceof Error ? e.message : "Unknown" }, { status: 500 })
    }
}