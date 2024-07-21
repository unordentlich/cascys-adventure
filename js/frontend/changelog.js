
document.addEventListener('DOMContentLoaded', () => {
    /**var json = loadGitHubChangelog();
    const container = document.getElementById('changelog-container');
    for (let i = 0; i < json.entries.length; i++) {
        const entry = json.entries[i]
        var e = document.createElement('div');
        e.classList.add('entry');
        e.innerHTML = entry.notes;
        container.appendChild(e);
    }**/

    visualizeList();
})

function visualizeList() {
    const previewList = document.getElementById('preview-list');
    var entries = localStorage.getItem('github-releases-request');
    console.log(entries);
    entries = JSON.parse(entries);
    entries = entries.entries;

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        let container = document.createElement('div');
        container.classList.add('entry');
        let flex = document.createElement('div');
        flex.classList.add('flex');

        let tag = document.createElement('p');
        tag.innerText = entry.version;
        let date = document.createElement('p');
        date.classList.add('sub');

        date.innerText = formatDate(Date.parse(entry.date));

        flex.appendChild(tag);
        flex.appendChild(date);

        let changes = document.createElement('p');
        changes.classList.add('sub');
        changes.classList.add('primary');
        changes.innerText = 'x Changes';

        container.appendChild(flex);
        container.appendChild(changes);
        previewList.appendChild(container);
    }
}

// Formatter for "Today" and "Yesterday" etc
const relative = new Intl.RelativeTimeFormat(
    'en-GB', {numeric: 'auto'}
  );
  // Formatter for weekdays, e.g. "Monday"
  const short = new Intl.DateTimeFormat(
    'en-GB', {weekday: 'long'}
  );
  // Formatter for dates, e.g. "Mon, 31 May 2021"
  const long = new Intl.DateTimeFormat(
    'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const formatDate = (date) => {
    const now = new Date();
    const then = date;
    const days = (then - now) / 86400000;
    if (days > -6) {
      if (days > -2) {
        return relative.format(days, 'day');
      }
      return short.format(date);
    }
    return long.format(date);
  };