


import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

const seedAdmin = async ()=>{
    try{

        console.log("admin seeding started")

        const adminData = {
            name: "Admin9",
            email: "admin9@admin.com",
            password: "admin123",
            role: UserRole.ADMIN,
            emailVerified: true
        }

        console.log("checking admin exit or not")

        // check user exists on db or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        if (existingUser) {
            console.log('Admin user already exists. Skipping seeding.');
            return;
        }

        const origin = process.env.APP_URL || 'http://localhost:4000';

        const signUpAdmin = await fetch(`http://localhost:3000/api/auth/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // match trustedOrigins from src/lib/auth.ts
                Origin: origin,
            },
            body: JSON.stringify(adminData)
        });

        console.log(signUpAdmin);

        if (signUpAdmin.ok) {
            console.log("Admin user created successfully");
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            });
        } else {
            // log the body so you can see the error message returned by better‑auth
            const text = await signUpAdmin.text();
            console.error('signup failed', signUpAdmin.status, text);
        }

    }catch(error){
        console.error('Error seeding admin user:', error);
    }

}

seedAdmin()