export function getYouTubeEmbedUrl(value?: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

    let videoId: string | null = null;
    if (host === 'youtu.be') {
      videoId = url.pathname.split('/')[1];
    } else if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      const segments = url.pathname.split('/');
      videoId = ['embed', 'shorts', 'live'].includes(segments[1])
        ? segments[2]
        : url.searchParams.get('v');
    }

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : null;
  } catch {
    return null;
  }
}
