import { corsHeaders } from '../_shared/cors.ts'
import { mockInterviewRespond } from '../_shared/gemini.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { conversationHistory, userAnswer, questionNumber, totalQuestions } = await req.json()
        if (!userAnswer) {
            return new Response(
                JSON.stringify({ error: 'userAnswer is required.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const result = await mockInterviewRespond(
            conversationHistory || [],
            userAnswer,
            questionNumber || 0,
            totalQuestions || 5
        )
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (err) {
        console.error('mock-interview-respond error:', err)
        return new Response(
            JSON.stringify({ error: 'Interviewer failed to respond. Please try again.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
