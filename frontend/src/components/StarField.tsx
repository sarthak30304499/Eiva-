import { useEffect, useRef } from 'react'

interface Star {
    x: number
    y: number
    r: number
    alpha: number
    speed: number
    twinkleDir: number
}

interface ShootingStar {
    x: number
    y: number
    len: number
    speed: number
    angle: number
    alpha: number
    active: boolean
    countdown: number
}

export default function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!

        let animId: number
        let W = window.innerWidth
        let H = window.innerHeight

        canvas.width = W
        canvas.height = H

        // Generate stars
        const count = Math.floor((W * H) / 2200)
        const stars: Star[] = Array.from({ length: count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.4 + 0.2,
            alpha: Math.random() * 0.6 + 0.2,
            speed: Math.random() * 0.008 + 0.003,
            twinkleDir: Math.random() > 0.5 ? 1 : -1,
        }))

        // Shooting stars
        const shooters: ShootingStar[] = Array.from({ length: 4 }, () => makeShooting())

        function makeShooting(): ShootingStar {
            return {
                x: Math.random() * W,
                y: Math.random() * H * 0.5,
                len: Math.random() * 180 + 80,
                speed: Math.random() * 9 + 5,
                angle: (Math.random() * 20 + 20) * (Math.PI / 180),
                alpha: 0,
                active: false,
                countdown: Math.random() * 400 + 150,
            }
        }

        function draw() {
            ctx.clearRect(0, 0, W, H)

            // Draw stars
            for (const s of stars) {
                s.alpha += s.speed * s.twinkleDir
                if (s.alpha >= 0.85) s.twinkleDir = -1
                if (s.alpha <= 0.12) s.twinkleDir = 1

                // Pick color: mostly white, some blue/purple tint
                const hue = Math.random() > 0.85 ? (Math.random() > 0.5 ? '220,210,255' : '180,240,255') : '255,255,255'
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${hue},${s.alpha.toFixed(2)})`
                ctx.fill()
            }

            // Draw shooting stars
            for (const sh of shooters) {
                if (!sh.active) {
                    sh.countdown--
                    if (sh.countdown <= 0) {
                        sh.active = true
                        sh.x = Math.random() * W
                        sh.y = Math.random() * H * 0.4
                        sh.alpha = 1
                    }
                    continue
                }

                sh.x += Math.cos(sh.angle) * sh.speed
                sh.y += Math.sin(sh.angle) * sh.speed
                sh.alpha -= 0.018

                if (sh.alpha <= 0 || sh.x > W || sh.y > H) {
                    Object.assign(sh, makeShooting())
                    continue
                }

                const grad = ctx.createLinearGradient(
                    sh.x, sh.y,
                    sh.x - Math.cos(sh.angle) * sh.len,
                    sh.y - Math.sin(sh.angle) * sh.len
                )
                grad.addColorStop(0, `rgba(255,255,255,${sh.alpha.toFixed(2)})`)
                grad.addColorStop(0.3, `rgba(180,210,255,${(sh.alpha * 0.6).toFixed(2)})`)
                grad.addColorStop(1, 'rgba(255,255,255,0)')

                ctx.beginPath()
                ctx.moveTo(sh.x, sh.y)
                ctx.lineTo(
                    sh.x - Math.cos(sh.angle) * sh.len,
                    sh.y - Math.sin(sh.angle) * sh.len
                )
                ctx.strokeStyle = grad
                ctx.lineWidth = sh.alpha * 1.8
                ctx.stroke()
            }

            animId = requestAnimationFrame(draw)
        }

        draw()

        const handleResize = () => {
            W = canvas.width = window.innerWidth
            H = canvas.height = window.innerHeight
        }
        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    )
}
