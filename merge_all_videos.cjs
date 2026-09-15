const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpeg = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';
const ffprobe = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffprobe.exe';

const rawDir = path.join(__dirname, 'downloaded_videos');
const normDir = path.join(rawDir, 'normalized');
if (!fs.existsSync(normDir)) fs.mkdirSync(normDir, { recursive: true });

const targetPublicDir = path.join(__dirname, 'MughalSteelFrontEndApplication', 'public', 'video');
if (!fs.existsSync(targetPublicDir)) fs.mkdirSync(targetPublicDir, { recursive: true });

const masterOutput = path.join(targetPublicDir, 'mughal-steel-hero-bg.mp4');

function getStreamInfo(filePath) {
  const out = execSync(`"${ffprobe}" -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 "${filePath}"`).toString().trim();
  const parts = out.split(',');
  return {
    width: parseInt(parts[0], 10),
    height: parseInt(parts[1], 10),
    duration: parseFloat(parts[2])
  };
}

async function processAll() {
  console.log('=== Starting Video Normalization & Merging ===');
  const fileListForConcat = [];

  for (let i = 1; i <= 17; i++) {
    const rawName = `vid_${String(i).padStart(2, '0')}.mp4`;
    const rawPath = path.join(rawDir, rawName);
    const partName = `part_${String(i).padStart(2, '0')}.mp4`;
    const partPath = path.join(normDir, partName);

    if (!fs.existsSync(rawPath)) {
      console.warn(`Missing: ${rawName}`);
      continue;
    }

    const info = getStreamInfo(rawPath);
    console.log(`\nProcessing [${i}/17] ${rawName} (${info.width}x${info.height}, ${info.duration.toFixed(1)}s)...`);

    // Determine start time and duration to capture best 6.5 - 7.5 seconds
    let startTime = 0;
    let clipDuration = info.duration;

    if (info.duration > 8.0) {
      startTime = 1.5; // skip initial camera positioning
      clipDuration = 6.5;
      if (startTime + clipDuration > info.duration) {
        startTime = Math.max(0, info.duration - clipDuration);
      }
    } else {
      startTime = 0;
      clipDuration = info.duration;
    }

    // Filter depending on orientation
    let filter = '';
    const isHorizontal = info.width >= info.height;

    if (isHorizontal) {
      filter = `[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1[outv]`;
    } else {
      // Vertical video: Fast blurred background (downscaled then blurred then upscaled for 10x speed) + centered sharp foreground
      filter = `[0:v]scale=320:180:force_original_aspect_ratio=increase,crop=320:180,boxblur=6:2,scale=1280:720,eq=brightness=-0.08:contrast=1.05[bg];[0:v]scale=-2:720[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[outv]`;
    }

    const cmd = `"${ffmpeg}" -y -ss ${startTime} -t ${clipDuration} -i "${rawPath}" -filter_complex "${filter}" -map "[outv]" -r 30 -c:v libx264 -preset veryfast -crf 23 -pix_fmt yuv420p -an "${partPath}"`;
    
    console.log(`Normalizing part ${i}: start=${startTime}s, dur=${clipDuration.toFixed(1)}s, horiz=${isHorizontal}`);
    execSync(cmd, { stdio: 'inherit' });

    fileListForConcat.push(partPath);
  }

  // Create concat list file
  const concatListFile = path.join(normDir, 'concat_list.txt');
  const concatContent = fileListForConcat.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatListFile, concatContent, 'utf8');

  console.log('\n=== Concatenating all 17 normalized segments into master background loop ===');
  const concatCmd = `"${ffmpeg}" -y -f concat -safe 0 -i "${concatListFile}" -c copy -movflags +faststart "${masterOutput}"`;
  execSync(concatCmd, { stdio: 'inherit' });

  // Verify master output
  if (fs.existsSync(masterOutput)) {
    const stats = fs.statSync(masterOutput);
    const masterInfo = getStreamInfo(masterOutput);
    console.log('\n=============================================');
    console.log('SUCCESS: Master Hero Video Created!');
    console.log(`Path: ${masterOutput}`);
    console.log(`Resolution: ${masterInfo.width}x${masterInfo.height}`);
    console.log(`Total Duration: ${masterInfo.duration.toFixed(1)} seconds (~${(masterInfo.duration / 60).toFixed(1)} min)`);
    console.log(`File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log('=============================================\n');
  } else {
    throw new Error('Master video file not found after concat!');
  }
}

processAll().catch(err => {
  console.error('Processing failed:', err);
  process.exit(1);
});
