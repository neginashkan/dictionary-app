const dictionaryAppForm = document.getElementById("dictionary-app-form");
const inputEl = document.getElementById("input");
const error = document.getElementById("error");

inputEl.addEventListener("focus", (event) => {
  event.preventDefault();
  error.classList.add("hidden");
});

function showResult(
  word,
  pronunciation,
  definition,
  example,
  audio,
  partOfSpeeches
) {
  const result = document.getElementById("result");
  result.innerHTML = `
            <div class="word-sound">
            <div class="word">${word}</div>
            <div class="sound">
              <audio id="voice">
                <source  src=${audio} type="audio/mp3" />
              </audio>
              <button class="volume-up-button" id="volume-button">
                <i class="fas fa-volume-up"></i>
              </button>
            </div>
          </div>
          <div class="details">
            <span class="part-of-speech" id="part-of-speech">${partOfSpeeches}</span>
            <span class="pronunciation" id="pronunciation">${pronunciation}</span>
          </div>
          <div class="word-meaning">
            ${definition}
          </div>
          <div class="word-example">${example}</div>`;
}

dictionaryAppForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const word = inputEl.value.toLowerCase();
  const invalidItems = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  let validWord = true;
  for (let i = 0; i < word.length; i++) {
    if (invalidItems.includes(word[i])) {
      error.classList.remove("hidden");
      validWord = false;
    }
  }
  if (word.trim() === "" || validWord === false) {
    error.classList.remove("hidden");
  } else {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    axios.get(apiUrl).then((response) => {
      const word = response.data[0].word;
      let pronunciation = response.data[0].phonetic;
      const meaningsArray = response.data[0].meanings;
      let partOfSpeeches = "";
      let arrayOFDefinitionExample = [];
      meaningsArray.forEach((element) => {
        partOfSpeeches += element.partOfSpeech + " , ";
        arrayOFDefinitionExample = element.definitions;
      });
      partOfSpeeches = partOfSpeeches.slice(0, -2);
      let definition = ``;
      let example = ``;
      arrayOFDefinitionExample.forEach((element) => {
        if ("example" in element) {
          example = element.example;
        }
        if (element.definition !== "") {
          definition = element.definition;
        }
      });
      const arrayOfSounds = response.data[0].phonetics;
      let audio = "";
      arrayOfSounds.forEach((element) => {
        if (element.audio !== "") {
          audio = element.audio;
        }
        if (element.text !== "") {
          pronunciation = element.text;
        }
      });
      showResult(
        word,
        pronunciation,
        definition,
        example,
        audio,
        partOfSpeeches
      );
      const voice = document.getElementById("voice");
      const volumeButton = document.getElementById("volume-button");
      volumeButton.addEventListener("click", (event) => {
        event.preventDefault();
        voice.play()
      });
    });
  }
});
