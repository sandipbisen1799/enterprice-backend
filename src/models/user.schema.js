import {z} from 'zod'

export const registerSchema = z.object({
  body: z.object({
       userName: z.string().min(2, "Username must be at least 2 characters"),

      email: z.string().email("Invalid email address"),

      password: z.string().min(3, "Password must be at least 6 characters"),

      accountType: z.enum(["admin", "projectManager", "teamMember"]),

      active: z.enum(["block", "unblock"]).optional(),

    //   ipAddress: z.string().ip().optional(),

      phoneNumber: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid phone number")
        .optional(),

    //   projectManager: objectId.optional(),

      isVerified: z.boolean().optional(),

      otp: z.string().length(4).optional(),

      otpExpiry: z.coerce.date().optional(),
  }),
});
