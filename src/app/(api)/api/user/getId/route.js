// api/user/getId
import { connectDB } from '@/lib/db';
import jwt from 'jsonwebtoken';
import UserModel from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return NextResponse.json({ message: 'No token provided!' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.SECRETKEY);

        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ userId: user._id });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
