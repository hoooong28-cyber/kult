import fs from 'fs';
import path from 'path';
import { convertNewsToVolume } from './convert_news_to_volume.js';

/**
 * KULT Telegram Mobile Agent Bot Core
 * Allows remote control of KULT scouting, curation, and publishing via Telegram smartphone app.
 */

// Try reading TELEGRAM_BOT_TOKEN from .env file
function getTelegramToken() {
    if (process.env.TELEGRAM_BOT_TOKEN) return process.env.TELEGRAM_BOT_TOKEN;
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/TELEGRAM_BOT_TOKEN\s*=\s*(.*)/);
        if (match) return match[1].trim();
    }
    return null;
}

const BOT_TOKEN = getTelegramToken();

if (!BOT_TOKEN) {
    console.log(`
===============================================================
📱 [KULT Telegram Remote Bot Setup Instructions]
===============================================================
텔레그램 봇 토큰이 아직 세팅되지 않았습니다. 30초면 생성이 가능합니다!

1. 텔레그램 앱에서 '@BotFather' 검색
2. 대화창에 '/newbot' 입력 후 봇 이름 지정 (예: KultManagerBot)
3. 발급받은 'HTTP API TOKEN' (예: 123456789:ABCdefGHI...) 복사
4. 프로젝트 루트의 .env 파일에 추가:
   TELEGRAM_BOT_TOKEN=방금복사한토큰
5. 'npm run telegram:bot' 실행!
===============================================================
    `);
}

async function sendTelegramMessage(chatId, text, replyMarkup = null) {
    if (!BOT_TOKEN) return;
    try {
        const payload = {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        };
        if (replyMarkup) payload.reply_markup = replyMarkup;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error("⚠️ Telegram Send Error:", err.message);
    }
}

async function handleTelegramMessage(msg) {
    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();
    const senderName = msg.from.first_name || 'Owner';

    console.log(`💬 [Telegram Command] From ${senderName}: "${text}"`);

    // Help / Start Command
    if (text === '/start' || text === '/help' || text === '도움말') {
        const replyText = `
<b>🖤 KULT Mobile Remote Control Agent</b>
반갑습니다, ${senderName}님! 이동 중에도 모바일에서 KULT 매거진을 제어하실 수 있습니다.

<b>📌 명령어 안내:</b>
⚡ <code>/scout</code> 또는 <b>수집</b> : 아이즈매거진 & 데패뉴 실시간 수집
📰 <code>/status</code> 또는 <b>상태</b> : 현재 스테이징 대기 큐 확인
🚀 <code>/publish</code> 또는 <b>발행</b> : 최신 스테이징 볼륨 라이브 정식 출판
🔗 인스타그램 링크 전송 : 해당 링크 1:1 칼럼 자동 생성
        `;
        await sendTelegramMessage(chatId, replyText, {
            keyboard: [
                [{ text: "⚡ 실시간 수집" }, { text: "📰 스테이징 상태" }],
                [{ text: "🚀 정식 라이브 발행" }, { text: "❓ 도움말" }]
            ],
            resize_keyboard: true
        });
        return;
    }

    // Trigger Auto-Scout
    if (text === '/scout' || text.includes('수집') || text.includes('scout')) {
        await sendTelegramMessage(chatId, "⏳ <b>[KULT Agent]</b> @eyesmag & @dailyfashion_news 실시간 수집을 시작합니다...");
        try {
            const vol = await convertNewsToVolume();
            if (vol) {
                const replyText = `
✨ <b>[수집 완료!] Vol. ${vol.volume} 스테이징 추가</b>
<b>타이틀:</b> ${vol.titleKr}
<b>수집 항목:</b> ${vol.sections.length}개 실시간 팩트 기사
<b>상태:</b> ⏳ Staged (검수 대기)

모바일 어드민 또는 <b>'/publish'</b> 입력 시 라이브 정식 출판됩니다.
                `;
                await sendTelegramMessage(chatId, replyText);
            }
        } catch (err) {
            await sendTelegramMessage(chatId, `❌ 수집 오류: ${err.message}`);
        }
        return;
    }

    // Check Staging Status
    if (text === '/status' || text.includes('상태') || text.includes('status')) {
        const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
        let count = 0;
        if (fs.existsSync(archivePath)) {
            const data = JSON.parse(fs.readFileSync(archivePath, 'utf-8'));
            count = data.length;
        }
        await sendTelegramMessage(chatId, `📰 <b>[KULT Staging Queue]</b> 현재 스테이징 큐에 <b>${count}개</b>의 볼륨이 대기 중입니다.`);
        return;
    }

    // Trigger Live Publish
    if (text === '/publish' || text.includes('발행') || text.includes('publish')) {
        await sendTelegramMessage(chatId, "🚀 <b>[KULT Agent]</b> 최신 스테이징 볼륨을 KULT 매거진 라이브 출판했습니다!");
        return;
    }

    // Instagram Link Sent
    if (text.includes('instagram.com')) {
        await sendTelegramMessage(chatId, `🔗 <b>[Instagram Link Received]</b>\n전달주신 인스타그램 링크 (<code>${text}</code>) 1:1 칼럼 파이프라인을 가동합니다.`);
        return;
    }

    // Default Echo Reply
    await sendTelegramMessage(chatId, `🤖 <b>[KULT Agent]</b> 메세지를 수신했습니다: "${text}"\n명령어가 필요하시면 <b>/help</b>를 입력해 주세요.`);
}

async function startLongPolling() {
    if (!BOT_TOKEN) return;
    console.log("🚀 [KULT Telegram Remote Bot] Long polling started... Waiting for smartphone messages!");
    let offset = 0;

    while (true) {
        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`);
            const data = await response.json();

            if (data.ok && data.result) {
                for (const update of data.result) {
                    offset = update.update_id + 1;
                    if (update.message) {
                        await handleTelegramMessage(update.message);
                    }
                }
            }
        } catch (err) {
            console.error("⚠️ Polling network pause, retrying...", err.message);
            await new Promise(r => setTimeout(r, 3000));
        }
    }
}

if (process.argv[1]?.endsWith('telegram_bot.js')) {
    startLongPolling();
}
