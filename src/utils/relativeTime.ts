export default function getRelativeTime(time: number) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style:"long"  });
    const now = new Date();
    const diff = time - now.getTime();
    
    const seconds = Math.round(diff / 1000);
    const minutes = Math.round(diff / (1000 * 60));
    const hours = Math.round(diff / (1000 * 60 * 60));
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
    const years = Math.round(diff / (1000 * 60 * 60 * 24 * 365));

    if (Math.abs(seconds) < 60) return rtf.format(seconds, 'seconds');
    if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minutes');
    if (Math.abs(hours) < 24) return rtf.format(hours, 'hours');
    if (Math.abs(days) < 30)   return rtf.format(days, 'days');
    if (Math.abs(days) < 365) return rtf.format(months, 'months');
    return rtf.format(years, 'years');
}