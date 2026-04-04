export const runtime = 'edge';

import { getMockAnalysis } from "@/services/analysis.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idea } = body;

    if (!idea || typeof idea !== 'string') {
      return Response.json(
        { error: 'Missing or invalid idea parameter' },
        { status: 400 }
      );
    }

    // TODO: Add AI provider integration here
    // For now, return mock analysis
    const analysis = getMockAnalysis(idea);

    return Response.json({
      status: 'ok',
      result: analysis,
      source: 'mock'
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
