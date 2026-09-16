import { ColoringBook } from '../types';

// Helper function to create clean black & white vector coloring line-art SVG data URLs
function createColoringSvg(svgContent: string): string {
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
    <rect width="100%" height="100%" fill="#ffffff" />
    <g stroke="#111111" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none">
      ${svgContent}
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
}

// 5 initial high quality black-and-white thick-line art scenes for "Space Dinosaurs"
export const SAMPLE_SPACE_DINOSAURS_BOOK: ColoringBook = {
  id: 'sample-space-dinosaurs',
  childName: 'Leo',
  theme: 'Space Dinosaurs',
  bookTitle: "Leo's Space Dinosaurs Adventure",
  dedication: "For Leo, the bravest astronaut dinosaur explorer in the galaxy!",
  imageSize: '1K',
  styleLevel: 'bold_simple',
  createdAt: Date.now(),
  pages: [
    {
      pageNumber: 1,
      sceneTitle: 'T-Rex Astronaut & the Lunar Rocket',
      storyCaption: 'Leo the mighty T-Rex straps on his space helmet and counts down: 3, 2, 1... Blast off to the stars!',
      imagePrompt: "Children's coloring book page, cute friendly T-Rex dinosaur wearing a round astronaut helmet standing next to a big cartoon rocket ship on the moon with craters and stars in the background, thick bold black outlines, pure white background, no shading, simple shapes for crayons.",
      status: 'ready',
      imageUrl: createColoringSvg(`
        <!-- Rocket -->
        <path d="M 440 220 C 440 120 400 60 380 40 C 360 60 320 120 320 220 L 320 360 L 440 360 Z" fill="#ffffff" />
        <circle cx="380" cy="180" r="35" fill="#ffffff" />
        <path d="M 320 300 L 270 380 L 320 380 Z" />
        <path d="M 440 300 L 490 380 L 440 380 Z" />
        <path d="M 350 360 L 380 430 L 410 360 Z" />
        <!-- Moon Ground -->
        <path d="M 20 680 Q 300 620 580 680" />
        <ellipse cx="140" cy="720" rx="40" ry="18" />
        <ellipse cx="460" cy="710" rx="55" ry="22" />
        <!-- T-Rex Astronaut -->
        <!-- Helmet -->
        <circle cx="210" cy="380" r="85" fill="#ffffff" />
        <circle cx="210" cy="380" r="68" stroke-dasharray="14,10" />
        <!-- T-Rex Face inside helmet -->
        <path d="M 170 360 Q 230 340 250 370 Q 250 400 220 410 L 180 410 Z" fill="#ffffff" />
        <circle cx="205" cy="365" r="7" fill="#111111" />
        <path d="M 190 395 Q 210 405 230 395" />
        <!-- Body & Backpack -->
        <path d="M 150 460 C 130 520 120 620 180 660 C 230 670 260 650 260 560 C 260 480 250 460 210 460 Z" fill="#ffffff" />
        <rect x="90" y="480" width="55" height="110" rx="14" fill="#ffffff" />
        <!-- Legs and Big Feet -->
        <path d="M 160 660 L 150 710 L 190 710" />
        <path d="M 230 655 L 240 710 L 280 710" />
        <!-- Cute Little Dinosaur Arms -->
        <path d="M 230 490 Q 275 490 280 520 Q 270 535 245 525" />
        <path d="M 230 530 Q 260 540 265 560" />
        <!-- Tail with space ring -->
        <path d="M 130 620 Q 70 650 40 640 Q 60 600 130 580" />
        <!-- Stars and Planets -->
        <circle cx="90" cy="140" r="28" />
        <ellipse cx="90" cy="140" rx="46" ry="12" />
        <polygon points="180,80 185,95 200,95 188,105 192,120 180,110 168,120 172,105 160,95 175,95" />
        <polygon points="500,100 504,112 516,112 506,120 510,132 500,124 490,132 494,120 484,112 496,112" />
        <polygon points="80,260 83,270 93,270 85,276 88,286 80,280 72,286 75,276 67,270 77,270" />
      `),
    },
    {
      pageNumber: 2,
      sceneTitle: 'Stegosaurus Floating Among the Asteroids',
      storyCaption: 'Zero gravity is so bouncy! Spike the Stegosaurus gently floats by starry cosmic asteroids.',
      imagePrompt: "Children's coloring book page, friendly cartoon Stegosaurus with big back plates floating peacefully in space wearing a bubble space helmet, floating asteroids and stars, thick clean black outlines, pure white background, coloring book style for kids.",
      status: 'ready',
      imageUrl: createColoringSvg(`
        <!-- Stegosaurus body -->
        <ellipse cx="300" cy="460" rx="140" ry="90" fill="#ffffff" />
        <!-- Back Plates -->
        <polygon points="200,380 220,310 250,380" fill="#ffffff" />
        <polygon points="255,372 280,290 310,372" fill="#ffffff" />
        <polygon points="315,372 345,295 375,372" fill="#ffffff" />
        <polygon points="380,380 405,315 430,385" fill="#ffffff" />
        <polygon points="435,400 455,340 475,410" fill="#ffffff" />
        <!-- Head and Helmet -->
        <circle cx="150" cy="460" r="75" fill="#ffffff" />
        <path d="M 120 450 Q 150 440 175 465 Q 165 485 130 480 Z" fill="#ffffff" />
        <circle cx="145" cy="455" r="6" fill="#111111" />
        <path d="M 130 470 Q 145 480 160 470" />
        <!-- Legs Floating -->
        <path d="M 230 540 Q 220 610 245 625 Q 265 615 260 550" />
        <path d="M 330 545 Q 325 615 350 630 Q 370 615 360 545" />
        <!-- Tail with spikes -->
        <path d="M 430 470 Q 520 470 540 430 Q 480 510 420 500" fill="#ffffff" />
        <line x1="510" y1="440" x2="535" y2="400" />
        <line x1="520" y1="455" x2="555" y2="435" />
        <line x1="500" y1="465" x2="535" y2="480" />
        <!-- Asteroids with craters -->
        <ellipse cx="100" cy="200" rx="50" ry="40" />
        <circle cx="85" cy="195" r="10" />
        <circle cx="120" cy="215" r="8" />
        <ellipse cx="490" cy="620" rx="60" ry="45" />
        <circle cx="470" cy="610" r="12" />
        <circle cx="515" cy="635" r="9" />
        <!-- Stars -->
        <polygon points="300,100 305,115 320,115 308,125 312,140 300,130 288,140 292,125 280,115 295,115" />
        <polygon points="120,650 123,660 133,660 125,666 128,676 120,670 112,676 115,666 107,660 117,660" />
      `),
    },
    {
      pageNumber: 3,
      sceneTitle: 'Triceratops Building a Moon Base',
      storyCaption: 'Clara the Triceratops uses her space shovel to build a cozy dome city on the moon dust.',
      imagePrompt: "Children's coloring book page, friendly Triceratops dinosaur with three horns in astronaut suit using a shovel near a futuristic geodesic bubble biodome on the moon surface, thick lines, pure white background, coloring book art for kids.",
      status: 'ready',
      imageUrl: createColoringSvg(`
        <!-- Moon Horizon -->
        <path d="M 10 590 Q 300 550 590 590" />
        <!-- Moon Base Dome -->
        <path d="M 340 560 A 150 150 0 0 1 560 560 Z" fill="#ffffff" />
        <path d="M 450 410 L 450 560" />
        <path d="M 380 445 L 520 445" />
        <path d="M 355 500 L 545 500" />
        <circle cx="450" cy="385" r="14" />
        <!-- Triceratops -->
        <ellipse cx="190" cy="500" rx="80" ry="60" fill="#ffffff" />
        <!-- Head and Frill -->
        <circle cx="270" cy="440" r="45" fill="#ffffff" />
        <path d="M 230 400 C 230 350 310 350 310 400" stroke-width="12" />
        <!-- Three Horns -->
        <polygon points="245,390 235,340 255,385" fill="#ffffff" />
        <polygon points="285,390 295,340 275,385" fill="#ffffff" />
        <polygon points="305,435 340,430 305,445" fill="#ffffff" />
        <circle cx="280" cy="430" r="6" fill="#111111" />
        <!-- Space Shovel -->
        <line x1="280" y1="510" x2="330" y2="600" stroke-width="10" />
        <rect x="315" y="590" width="40" height="35" rx="5" fill="#ffffff" />
        <!-- Legs -->
        <path d="M 140 550 L 135 610 L 165 610" />
        <path d="M 210 550 L 210 610 L 240 610" />
        <!-- Little alien flower in pot -->
        <ellipse cx="100" cy="620" rx="20" ry="8" />
        <rect x="85" y="620" width="30" height="30" fill="#ffffff" />
        <line x1="100" y1="620" x2="100" y2="590" />
        <circle cx="100" cy="580" r="10" />
        <!-- Stars -->
        <circle cx="150" cy="180" r="18" />
        <polygon points="240,110 244,122 256,122 246,130 250,142 240,134 230,142 234,130 224,122 236,122" />
      `),
    },
    {
      pageNumber: 4,
      sceneTitle: 'Pterodactyl Soaring Past Saturn Rings',
      storyCaption: 'Pip the Pterodactyl glides gracefully past shiny planetary rings, waving hello to shooting stars!',
      imagePrompt: "Children's coloring book page, cute Pterodactyl dinosaur flying through outer space wearing pilot goggles and mini jetpack, giant ringed planet Saturn and shooting stars in the background, bold thick black lines, pure white background, coloring book style for kids.",
      status: 'ready',
      imageUrl: createColoringSvg(`
        <!-- Saturn in background -->
        <circle cx="440" cy="220" r="90" fill="#ffffff" />
        <ellipse cx="440" cy="220" rx="170" ry="32" stroke-width="12" />
        <!-- Pterodactyl Flying -->
        <!-- Wings -->
        <path d="M 230 450 Q 80 340 30 380 Q 120 480 200 490" fill="#ffffff" />
        <path d="M 280 440 Q 420 330 480 360 Q 380 470 300 480" fill="#ffffff" />
        <!-- Body -->
        <ellipse cx="250" cy="480" rx="35" ry="60" fill="#ffffff" />
        <!-- Head & Crest -->
        <path d="M 250 430 Q 230 360 210 350 Q 240 390 280 410 Q 320 420 360 410 Q 310 440 260 440 Z" fill="#ffffff" />
        <!-- Goggles -->
        <circle cx="265" cy="415" r="14" fill="#ffffff" stroke-width="6" />
        <circle cx="265" cy="415" r="5" fill="#111111" />
        <path d="M 240 420 L 252 420" />
        <!-- Jetpack on back -->
        <rect x="235" y="490" width="30" height="45" rx="8" fill="#ffffff" />
        <path d="M 240 535 Q 250 570 245 590 Q 255 570 260 535" stroke-width="6" />
        <!-- Feet -->
        <path d="M 235 535 L 220 575 L 235 575" />
        <path d="M 265 535 L 275 575 L 290 575" />
        <!-- Shooting Stars -->
        <line x1="120" y1="180" x2="220" y2="220" stroke-width="8" stroke-dasharray="16,8" />
        <polygon points="220,220 223,230 233,230 225,236 228,246 220,240 212,246 215,236 207,230 217,230" />
        <!-- Extra Stars -->
        <polygon points="120,620 124,632 136,632 126,640 130,652 120,644 110,652 114,640 104,632 116,632" />
        <polygon points="480,560 483,570 493,570 485,576 488,586 480,580 472,586 475,576 467,570 477,570" />
      `),
    },
    {
      pageNumber: 5,
      sceneTitle: 'The Great Space Dinosaur Picnic Celebration',
      storyCaption: 'Mission accomplished! All the dino friends gather to toast space juice and celebrate Leo the grand explorer!',
      imagePrompt: "Children's coloring book page, cartoon dinosaurs having a happy picnic on the moon with a picnic blanket, space juice cups, star banner, waving flags, bold thick lines, pure white background, coloring book style for kids.",
      status: 'ready',
      imageUrl: createColoringSvg(`
        <!-- Starry Garland Banner -->
        <path d="M 40 120 Q 300 200 560 120" stroke-width="6" stroke-dasharray="12,8" />
        <polygon points="120,150 124,162 136,162 126,170 130,182 120,174 110,182 114,170 104,162 116,162" />
        <polygon points="220,165 224,177 236,177 226,185 230,197 220,189 210,197 214,185 204,177 216,177" />
        <polygon points="320,170 324,182 336,182 326,190 330,202 320,194 310,202 314,190 304,182 316,182" />
        <polygon points="420,160 424,172 436,172 426,180 430,192 420,184 410,192 414,180 404,172 416,172" />
        <!-- Ground / Moon surface -->
        <path d="M 20 620 Q 300 580 580 620" />
        <!-- Picnic Blanket with checks -->
        <polygon points="140,630 460,630 500,720 100,720" fill="#ffffff" stroke-width="8" />
        <line x1="180" y1="630" x2="160" y2="720" stroke-width="4" />
        <line x1="260" y1="630" x2="260" y2="720" stroke-width="4" />
        <line x1="340" y1="630" x2="360" y2="720" stroke-width="4" />
        <line x1="420" y1="630" x2="440" y2="720" stroke-width="4" />
        <!-- Picnic Basket and Juice Cups -->
        <rect x="270" y="580" width="60" height="45" rx="8" fill="#ffffff" />
        <path d="M 280 580 C 280 550 320 550 320 580" />
        <polygon points="360,600 375,600 370,625 365,625" fill="#ffffff" />
        <line x1="368" y1="600" x2="365" y2="585" />
        <!-- Happy Dino 1 (Left) -->
        <circle cx="170" cy="460" r="45" fill="#ffffff" />
        <circle cx="185" cy="455" r="5" fill="#111111" />
        <path d="M 175 475 Q 195 485 205 470" />
        <ellipse cx="150" cy="540" rx="45" ry="60" fill="#ffffff" />
        <path d="M 175 510 L 210 490" stroke-width="8" />
        <!-- Happy Dino 2 (Right) with party hat -->
        <circle cx="430" cy="460" r="45" fill="#ffffff" />
        <circle cx="415" cy="455" r="5" fill="#111111" />
        <path d="M 405 475 Q 415 485 435 470" />
        <ellipse cx="450" cy="540" rx="45" ry="60" fill="#ffffff" />
        <!-- Party Hat -->
        <polygon points="415,420 445,420 430,360" fill="#ffffff" />
        <circle cx="430" cy="355" r="6" />
        <!-- Flag planted by Leo -->
        <line x1="80" y1="460" x2="80" y2="620" stroke-width="10" />
        <polygon points="80,460 145,490 80,520" fill="#ffffff" stroke-width="6" />
        <!-- Earth in Sky -->
        <circle cx="300" cy="320" r="60" fill="#ffffff" />
        <path d="M 270 300 Q 290 280 320 300 Q 330 330 300 340 Z" stroke-width="4" />
        <path d="M 280 350 Q 310 365 335 350" stroke-width="4" />
      `),
    },
  ],
};

export const POPULAR_THEMES = [
  { name: 'Space Dinosaurs', icon: '🚀🦖', desc: 'T-Rex astronauts, moon bases, and Saturn gliders' },
  { name: 'Magical Forest Bakery', icon: '🧁🐻', desc: 'Bears baking cupcakes, squirrel tea parties, cookie trees' },
  { name: 'Underwater Superhero Kittens', icon: '🦸‍♀️🐱', desc: 'Caped kittens saving dolphins and coral reefs' },
  { name: 'Construction Animals on Mars', icon: '🚜🦫', desc: 'Bulldozer beavers & excavator giraffes' },
  { name: 'Princess Robot Grand Prix', icon: '👑🏎️', desc: 'Futuristic royal racecars, glowing neon tracks' },
  { name: 'Deep Sea Treasure Explorers', icon: '🐙🏴‍☠️', desc: 'Friendly octopuses, pirate shipwrecks, glowing pearls' },
];

export const CRAYON_PALETTES = [
  { name: 'Cosmic Sky', colors: ['#1e1b4b', '#3b82f6', '#06b6d4', '#f59e0b', '#ec4899'] },
  { name: 'Dino Jungle', colors: ['#15803d', '#84cc16', '#eab308', '#d97706', '#78350f'] },
  { name: 'Sweet Candy', colors: ['#f43f5e', '#ec4899', '#a855f7', '#38bdf8', '#fbbf24'] },
  { name: 'Ocean Splash', colors: ['#0284c7', '#06b6d4', '#14b8a6', '#facc15', '#f97316'] },
];
