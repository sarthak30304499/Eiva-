import { corsHeaders } from '../_shared/cors.ts'
import { analyzeResume } from '../_shared/gemini.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { resumeText, jobRole } = await req.json()
        if (!resumeText || !jobRole) {
            return new Response(
                JSON.stringify({ error: 'resumeText and jobRole are required.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const result = await analyzeResume(resumeText, jobRole)
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (err) {
        console.error('ats-check error:', err)
        return new Response(
            JSON.stringify({ error: 'AI analysis failed. Please try again.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
