import { corsHeaders } from '../_shared/cors.ts'
import { generateScorecard } from '../_shared/gemini.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { conversationHistory } = await req.json()
        if (!conversationHistory?.length) {
            return new Response(
                JSON.stringify({ error: 'conversationHistory is required.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const result = await generateScorecard(conversationHistory)
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (err) {
        console.error('mock-interview-scorecard error:', err)
        return new Response(
            JSON.stringify({ error: 'Failed to generate scorecard. Please try again.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
