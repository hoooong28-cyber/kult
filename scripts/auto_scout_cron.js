import { convertNewsToVolume } from './convert_news_to_volume.js';

/**
 * KULT Automated Media Scout Daemon
 * Runs periodically to auto-scout live published articles from Eyesmag and Daily Fashion News.
 */
async function runAutoScoutDaemon() {
    console.log("⏰ [KULT Scout Daemon] Triggering scheduled media scout cycle...");
    try {
        await convertNewsToVolume();
        console.log("✅ [KULT Scout Daemon] Scout cycle completed successfully.");
    } catch (err) {
        console.error("❌ [KULT Scout Daemon] Scout cycle error:", err.message);
    }
}

runAutoScoutDaemon();
