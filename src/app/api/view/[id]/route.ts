import { NextRequest, NextResponse } from 'next/server';
import { getFilePath } from '@/lib/storage';
import fs from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const filePath = await getFilePath(id);

    if (!filePath || !fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': 'chemical/x-mmcif',
            'Content-Disposition': 'inline',
        },
    });
}
