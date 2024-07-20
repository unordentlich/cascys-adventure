

### Cascy's Coding Adventure
Embark on a journey through the depths of web design and become a pro with CSS!

---

#### Story
Cascy is looking for one of his lost cascading style sheets. He has lost it in the depths of an open pixel world and is now embarking on a long journey to get this valuable piece back. **Only you can help him** make the hard journey by tackling the story-driven tasks and mastering them with a **cool head** and some **CSS snippets**.

Cascy playfully teaches you the various properties in the language of today's web design, from simple coloring, scaling and shifting of text and containers to fancy animations and media queries that will have you mastering almost all the tools of UI design by the end of the story.

---

#### Do you already feel confident in web development? Feel free to contribute!

To add to the concept around Cascy's journey through the depths of web development, the actual game was also built using HTML, CSS, JavaScript and NodeJS (via Electron Framework).

There are a variety of ways to support the game in its brilliance. Be it **new translations**, **features**, **levels**, **assets**, **sounds**, **music**, **dialogs** or even **bug fixes**.

<br>

##### How can I submit new translations?
There are over 140 languages and every single one is worth translating! If you would like to contribute to this important goal, you can do so as follows.


1. **Fork** this repository and clone/download it on your desktop
2. Navigate to `/assets/i18n` and check if a file for your language already exists. If so, you can skip to step **6**.
3. Create a new JSON file in the directory. The name should be the language code of the desired language. For example for *Italian*, it would look like this: `/assets/i18n/it.json`.
4. Open the file and place curly brackets in it. The file content should then look like this: `{}`.
5. Register the new language by navigating to `/js/frontend/general.js:1` and add the language code to the array at the first line.
6. You can now start translating content. The key of specific elements can be found in their HTML Code with the `i18n` attribute. See this example: `<p i18n="general.settings.title">Settings</p>`. Every dot defines a deeper layer. In this case, the file would have to look like this:
```
{
    "general": {
        "settings": {
            "title": "Impostazioni"
        }
    }
}
```

As soons as you're finished, just open a [Pull Request](https://docs.github.com/de/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) to push your changes to the world. Thank you so much for your help!

<br>

##### How can I submit new features?
I am honored that new ideas and features also want to be brought to the track through the creativity of great members of the developer community, however Cascy's Coding Adventure is currently still in a state of development. As a personal project for the [**HackClub Arcade 2024**](https://hackclub.com/arcade) event, I unfortunately do not currently have the time or oversight to dedicate to external submissions for new functionality.

I would love to receive submissions for CCA starting August 31st, the end of HackClub's Arcade event this year, to make the game even more awesome and content-rich. Thank you very much!

<br>

##### How can I submit new levels?
This type of contribution will be documented shortly. At the moment I am still working on the **Level Creator**, which is absolutely necessary to be able to create new levels. But it shouldn't take much longer!

<br>

##### How can I submit new assets, sounds, music or dialogs?
A good game thrives on playful, creative and high-quality assets in the form of audio, graphics and text. If you would like to make a contribution to this, you are welcome to fork the project and add the appropriate assets in a suitable place!

Please place the assets in a logical structure in the `/assets` directory.

If you have the creativity and motivation to create new assets, but you still lack the extra development skills, that's no problem! Feel free to create an issue with corresponding labels so that I or other developers can add your assets for you and immortalize them in the game.
Thank you!

<br>

##### How can I submit bug fixes?
Bugs are always annoying and take the fun out of the game! But since game developers are only human, bugs can't be completely prevented.

If you have found a bug that you would like to fix yourself, please fork the repository and fix it yourself.

Otherwise, you can also create an issue with the corresponding labels so that other developers have the opportunity to fix the bug.
Thank you very much for your help!
