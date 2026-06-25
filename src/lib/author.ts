export type AuthorLink = {
  label: string;
  href: string;
  icon: "github" | "x";
};

export const author = {
  name: "ひなた",
  role: "Web エンジニア",
  initials: "ひ",
  // 任意: "/images/avatar.png"（未指定ならイニシャル表示）
  avatar: "",
  bio: "Web開発を中心に、学んだことや試したことを書いています。フロントエンド・インフラ・設計が中心。",
  links: [
    { label: "GitHub", href: "https://github.com", icon: "github" },
    { label: "X", href: "https://x.com", icon: "x" },
  ] as AuthorLink[],
};
