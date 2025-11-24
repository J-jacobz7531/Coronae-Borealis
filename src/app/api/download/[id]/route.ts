import { NextRequest, NextResponse } from 'next/server';
import { getFilePath, getHistory } from '@/lib/storage';
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

    const history = await getHistory();
    const item = history.find((i) => i.id === id);
    const originalName = item?.originalName || 'download.cif';

    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Disposition': `attachment; filename="${originalName}"`,
            'Content-Type': 'application/octet-stream',
        },
    });
}
