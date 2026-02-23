import { corsHeaders } from '../_shared/cors.ts'
import { optimizeLinkedIn } from '../_shared/gemini.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { headline, summary, targetRole } = await req.json()
        if (!headline || !summary || !targetRole) {
            return new Response(
                JSON.stringify({ error: 'headline, summary, and targetRole are required.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const result = await optimizeLinkedIn(headline, summary, targetRole)
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (err) {
        console.error('linkedin-optimize error:', err)
        return new Response(
            JSON.stringify({ error: 'Optimization failed. Please try again.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
