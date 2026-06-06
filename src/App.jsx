import { useState } from "react";

function generateSecretCode() {
  const digits = [];

  while (digits.length < 4) {
    const randomDigit = Math.floor(Math.random() * 10).toString();

    if (!digits.includes(randomDigit)) {
      digits.push(randomDigit);
    }
  }
  console.log(digits); // esto solo es para ver el codigo secreto en la consola
  return digits.join("");
}

function evaluateGuess(secretCode, guess) {
  const secret = secretCode.split("");
  const attempt = guess.split("");
  const secretRemaining = [...secret];
  const attemptRemaining = [...attempt];

  let correctPosition = 0;
  let correctNumberWrongPosition = 0;

  for (let i = 0; i < 4; i++) {
    if (attempt[i] === secret[i]) {
      correctPosition++;
      secretRemaining[i] = null;
      attemptRemaining[i] = null;
    }
  }

  for (let i = 0; i < 4; i++) {
    const digit = attemptRemaining[i];
    if (digit === null) continue;

    const indexInSecret = secretRemaining.indexOf(digit);
    if (indexInSecret !== -1) {
      correctNumberWrongPosition++;
      secretRemaining[indexInSecret] = null;
    }
  }

  return {
    stars: "*".repeat(correctPosition),
    checks: "✓".repeat(correctNumberWrongPosition),
  };
}

export default function CodeBreaker() {
  const [secretCode, setSecretCode] = useState(generateSecretCode);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("");
  const [won, setWon] = useState(false);

  const hasRepeatedDigits = (value) => new Set(value).size !== value.length;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (won) return;

    if (guess.length !== 4) {
      setMessage("El intento debe tener exactamente 4 dígitos.");
      return;
    }

    if (hasRepeatedDigits(guess)) {
      setMessage("No puedes repetir números.");
      return;
    }

    const result = evaluateGuess(secretCode, guess);
    const feedback = `${result.stars}${result.checks}`;

    setAttempts((prev) => [{ guess, feedback }, ...prev]);
    setGuess("");
    setMessage("");

    if (result.stars === "****") {
      setWon(true);
      setMessage("¡Excelente! Descubriste el código.");
    }
  };

  const restartGame = () => {
    setSecretCode(generateSecretCode());
    setGuess("");
    setAttempts([]);
    setMessage("");
    setWon(false);
  };

  return (
    <main className="game">
      <header className="game__header">
        <h1>Code Breaker</h1>
        <p className="game__subtitle">Adivina el codigo numerico de 4 dígitos sin que se repitan los numeros
        </p>
      </header>

      <section className="game__rules">
        <p>
          <strong>✓</strong> = dígito correcto, posición incorrecta
        </p>
        <p>
          <strong>*</strong> = dígito en la posición correcta
        </p>
      </section>

      <form className="guess-form" onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="guess-input" className="guess-form__label">
          Tu intento
        </label>
        <div className="guess-form__row">
          <input
            id="guess-input"
            className="guess-form__input"
            inputMode="numeric"
            maxLength={4}
            placeholder="----"
            value={guess}
            disabled={won}
            autoFocus
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setGuess(value);
              if (message) setMessage("");
            }}
          />
          <button type="submit" className="btn btn--primary" disabled={won}>
            Intentar
          </button>
        </div>
        {message && <p className="guess-form__error">{message}</p>}
      </form>

      <section className="attempts">
        <div className="attempts__header">
          <h2>Historial</h2>
          <button type="button" className="btn btn--ghost" onClick={restartGame}>
            Nuevo juego
          </button>
        </div>

        {attempts.length === 0 ? (
          <p className="attempts__empty">¡Empieza a adivinar!</p>
        ) : (
          <ul className="attempts__list">
            {attempts.map((attempt, index) => (
              <li key={index} className="attempt-item">
                <span className="attempt-item__guess">{attempt.guess}</span>
                <span className="attempt-item__feedback">
                  {attempt.feedback && (
                    <>
                      {attempt.feedback.split("").map((symbol, i) => (
                        <span
                          key={i}
                          className={
                            symbol === "*"
                              ? "feedback-star"
                              : symbol === "✓"
                                ? "feedback-check"
                                : ""
                          }
                        >
                          {symbol}
                        </span>
                      ))}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {won && (
        <div className="modal">
          <div className="modal__content">
            <h2>¡Ganaste!</h2>
            <p>
              Descifraste el código en {attempts.length} intento
              {attempts.length === 1 ? "" : "s"}.
            </p>
            <p className="modal__code">
              Código: <strong>{secretCode}</strong>
            </p>
            <button type="button" className="btn btn--primary" onClick={restartGame}>
              Jugar de nuevo
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
