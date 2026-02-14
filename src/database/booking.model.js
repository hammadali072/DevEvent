import { Schema, model, models } from "mongoose";
import Event from "./event.model";

const BookingSchema = new Schema(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event ID is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            validate: {
                validator: function (email) {
                    // RFC 5322 email regex
                    const emailRegex =
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                    return emailRegex.test(email);
                },
                message: "Please provide a valid email address",
            },
        },
    },
    {
        timestamps: true,
    }
);

// 🔥 Pre-save hook: check event exists
BookingSchema.pre("save", async function (next) {
    const booking = this;

    if (booking.isModified("eventId") || booking.isNew) {
        try {
            const eventExists = await Event.findById(booking.eventId).select("_id");

            if (!eventExists) {
                const error = new Error(
                    `Event with ID ${booking.eventId} does not exist`
                );
                error.name = "ValidationError";
                return next(error);
            }
        } catch (err) {
            const validationError = new Error(
                "Invalid event ID format or database error"
            );
            validationError.name = "ValidationError";
            return next(validationError);
        }
    }

    next();
});

// Indexes for performance
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });

// Unique booking per event per email
BookingSchema.index(
    { eventId: 1, email: 1 },
    { unique: true, name: "uniq_event_email" }
);

// Next.js safe model export
const Booking = models.Booking || model("Booking", BookingSchema);

export default Booking;
