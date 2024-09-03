// media-options.ts

export interface MediaItem {
  src: string;
  type: 'image' | 'gif' | 'audio' | 'video';
  category: string;
}

export const images: MediaItem[] = [
  // Remilia
  { src: "/media/remilia/forever.jpeg", type: "image", category: "remilia" },

  // Cult
  { src: "/media/remilia/cult/ahhh.jpeg", type: "image", category: "cult" },
  { src: "/media/remilia/cult/blue.jpeg", type: "image", category: "cult" },
  { src: "/media/remilia/cult/cheeseworld.jpeg", type: "image", category: "cult" },
  { src: "/media/remilia/cult/ciggy.jpeg", type: "image", category: "cult" },
  { src: "/media/remilia/cult/icecream.jpg", type: "image", category: "cult" },
  { src: "/media/remilia/cult/walk.png", type: "image", category: "cult" },

  // Milady
  { src: "/media/remilia/milady/bubble.jpeg", type: "image", category: "milady" },
  { src: "/media/remilia/milady/cowboy.jpeg", type: "image", category: "milady" },
  { src: "/media/remilia/milady/money.jpeg", type: "image", category: "milady" },
  { src: "/media/remilia/milady/you.jpeg", type: "image", category: "milady" },

  // Remilio
  { src: "/media/remilia/remilio/please.jpeg", type: "image", category: "remilio" },
  { src: "/media/remilia/remilio/remiremi.png", type: "image", category: "remilio" },
  { src: "/media/remilia/remilio/remiremiremi.png", type: "image", category: "remilio" },

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
  { src: "/media/chud/head-down-crying.png", type: "image", category: "chud" },
  { src: "/media/chud/tears-of-joy.jpeg", type: "image", category: "chud" },

  // Misc
  { src: "/media/misc/normal.jpeg", type: "image", category: "misc" },
  { src: "/media/misc/john_martin.jpeg", type: "image", category: "misc" },

  // Sound Library
];

export const gifs: MediaItem[] = [
  { src: "/media/remilia/miladycraft.gif", type: "gif", category: "remilia" },
  { src: "/media/remilia/remigradientbg.gif", type: "gif", category: "remilia" },
  { src: "/media/chud/chudjak-walking.gif", type: "gif", category: "chud" },
  { src: "/media/misc/oscar.gif", type: "gif", category: "misc" },
  { src: "/media/misc/smile.gif", type: "gif", category: "misc" },

];

export const videos: MediaItem[] = [
  { src: "/media/remilia/yippee.mp4", type: "video", category: "remilia" },
  { src: "/media/misc/heavy_wash.mp4", type: "video", category: "misc" },
  { src: "/media/misc/jakechat_edit.mp4", type: "video", category: "misc" },
  { src: "/media/misc/jump.mp4", type: "video", category: "misc" },
  { src: "/media/misc/gemmy.mp4", type: "video", category: "misc" },
  { src: "/media/misc/holyMoly.webm", type: "video", category: "misc" },
  { src: "/media/misc/mario64_seal.mp4", type: "video", category: "misc" },
  { src: "/media/misc/plan_trusters.mp4", type: "video", category: "misc" },
  { src: "/media/sanko/pump.mp4", type: "video", category: "sanko" },
  { src: "/media/sanko/shuttle.mp4", type: "video", category: "sanko" },
  { src: "/media/sanko/virtue.mp4", type: "video", category: "sanko" },

];

export const sounds: MediaItem[] = [
  { src: "/sounds/block.mp3", type: "audio", category: "sound" },
  { src: "/sounds/braam.mp3", type: "audio", category: "sound" },
  { src: "/sounds/brass.mp3", type: "audio", category: "sound" },
  { src: "/sounds/calm_jazz.mp3", type: "audio", category: "sound" },
  { src: "/sounds/certain.mp3", type: "audio", category: "sound" },
  { src: "/sounds/chime.mp3", type: "audio", category: "sound" },
  { src: "/sounds/club_beat.mp3", type: "audio", category: "sound" },
  { src: "/sounds/coins.mp3", type: "audio", category: "sound" },
  { src: "/sounds/gameboy.mp3", type: "audio", category: "sound" },
  { src: "/sounds/level_up.mp3", type: "audio", category: "sound" },
  { src: "/sounds/magic.mp3", type: "audio", category: "sound" },
  { src: "/sounds/mariachi.mp3", type: "audio", category: "sound" },
  { src: "/sounds/menu.mp3", type: "audio", category: "sound" },
  { src: "/sounds/metal_gear.mp3", type: "audio", category: "sound" },
  { src: "/sounds/new_item.mp3", type: "audio", category: "sound" },
  { src: "/sounds/nintendogs.mp3", type: "audio", category: "sound" },
  { src: "/sounds/notification.mp3", type: "audio", category: "sound" },
  { src: "/sounds/notification_2.mp3", type: "audio", category: "sound" },
  { src: "/sounds/notification_3.mp3", type: "audio", category: "sound" },
  { src: "/sounds/notification_4.mp3", type: "audio", category: "sound" },
  { src: "/sounds/panflute.mp3", type: "audio", category: "sound" },
  { src: "/sounds/pluck.mp3", type: "audio", category: "sound" },
  { src: "/sounds/pop.mp3", type: "audio", category: "sound" },
  { src: "/sounds/royal_decree.mp3", type: "audio", category: "sound" },
  { src: "/sounds/sprite.mp3", type: "audio", category: "sound" },
  { src: "/sounds/sprite_2.mp3", type: "audio", category: "sound" },
  { src: "/sounds/sprite_3.mp3", type: "audio", category: "sound" },
  { src: "/sounds/subtle_beat.mp3", type: "audio", category: "sound" },
  { src: "/sounds/welcome.mp3", type: "audio", category: "sound" },
  { src: "/sounds/yeeeeeeehaw.mp3", type: "audio", category: "sound" },


];


