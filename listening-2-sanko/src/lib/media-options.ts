// media-options.ts

export interface MediaItem {
  src: string;
  type: 'image' | 'audio' | 'video';
  category: string;
}

export const mediaOptions: MediaItem[] = [
  // Remilia
  { src: "/media/remilia/forever.jpeg", type: "image", category: "remilia" },
  { src: "/media/remilia/miladycraft.gif", type: "image", category: "remilia" },
  { src: "/media/remilia/remigradientbg.gif", type: "image", category: "remilia" },
  { src: "/media/remilia/yippee.mp4", type: "video", category: "remilia" },

  // Cult
  { src: "/media/cult/ahhh.jpeg", type: "image", category: "cult" },
  { src: "/media/cult/blue.jpeg", type: "image", category: "cult" },
  { src: "/media/cult/cheeseworld.jpeg", type: "image", category: "cult" },
  { src: "/media/cult/ciggy.jpeg", type: "image", category: "cult" },
  { src: "/media/cult/icecream.jpg", type: "image", category: "cult" },
  { src: "/media/cult/walk.png", type: "image", category: "cult" },

  // Milady
  { src: "/media/milady/bubble.jpeg", type: "image", category: "milady" },
  { src: "/media/milady/cowboy.jpeg", type: "image", category: "milady" },
  { src: "/media/milady/money.jpeg", type: "image", category: "milady" },
  { src: "/media/milady/you.jpeg", type: "image", category: "milady" },

  // Remilio
  { src: "/media/remilio/please.jpeg", type: "image", category: "remilio" },
  { src: "/media/remilio/remiremi.png", type: "image", category: "remilio" },
  { src: "/media/remilio/remiremiremi.png", type: "image", category: "remilio" },

  // Sanko
  { src: "/media/sanko/cowboyBun.jpeg", type: "image", category: "sanko" },
  { src: "/media/sanko/devil.jpeg", type: "image", category: "sanko" },
  { src: "/media/sanko/glass.jpeg", type: "image", category: "sanko" },
  { src: "/media/sanko/good.jpeg", type: "image", category: "sanko" },
  { src: "/media/sanko/snek.jpeg", type: "image", category: "sanko" },
  { src: "/media/sanko/sproto.jpeg", type: "image", category: "sanko" },
  { src: "/media/sanko/ticker.png", type: "image", category: "sanko" },
  { src: "/media/sanko/turni.jpeg", type: "image", category: "sanko" },

  // Chud
  { src: "/media/chud/chudjak-walking.gif", type: "image", category: "chud" },
  { src: "/media/chud/head-down-crying.png", type: "image", category: "chud" },
  { src: "/media/chud/tears-of-joy.jpeg", type: "image", category: "chud" },

  // Misc
  { src: "/media/misc/jump.mp4", type: "video", category: "misc" },
  { src: "/media/misc/normal.jpeg", type: "image", category: "misc" },
  { src: "/media/misc/oscar.gif", type: "image", category: "misc" },
  { src: "/media/misc/smile.gif", type: "image", category: "misc" },

  // Sound Library
  { src: "/media/audio/club_beat.mp3", type: "audio", category: "sound" },
  { src: "/media/audio/notification.mp3", type: "audio", category: "sound" },
  { src: "/media/audio/pop.mp3", type: "audio", category: "sound" },
];
