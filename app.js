const STORAGE_KEY = "mis_puntos_v1";

let data = {
    girls: []
};

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        data = JSON.parse(saved);
    }
}

function saveData() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}

function addGirl() {

    const name = prompt("Nombre de la niña:");

    if (!name || !name.trim()) {
        return;
    }

    data.girls.push({
        id: Date.now(),
        name: name.trim(),
        points: 0,
        history: []
    });

    saveData();

    render();
}

function addPoints(girlId, points, description) {

    const girl = data.girls.find(
        girl => girl.id === girlId
    );

    if (!girl) {
        return;
    }

    girl.points += points;

    girl.history.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        points: points,
        description: description
    });

    saveData();

    render();
}

function deleteGirl(girlId) {

    const girl = data.girls.find(
        girl => girl.id === girlId
    );

    if (!girl) {
        return;
    }

    const confirmation = confirm(
        `¿Quieres borrar a ${girl.name} y todo su historial?`
    );

    if (!confirmation) {
        return;
    }

    data.girls = data.girls.filter(
        girl => girl.id !== girlId
    );

    saveData();

    render();
}

function deleteHistoryItem(girlId, historyId) {

    const girl = data.girls.find(
        girl => girl.id === girlId
    );

    if (!girl) {
        return;
    }

    const item = girl.history.find(
        item => item.id === historyId
    );

    if (!item) {
        return;
    }

    girl.points -= item.points;

    girl.history = girl.history.filter(
        item => item.id !== historyId
    );

    saveData();

    render();
}

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString(
        "es-ES",
        {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

function render() {

    const container =
        document.getElementById("girls");

    container.innerHTML = "";

    if (data.girls.length === 0) {

        container.innerHTML = `
            <div class="girl">
                <p>
                    Todavía no has añadido ninguna niña.
                </p>

                <p>
                    Pulsa "Añadir niña" para comenzar.
                </p>
            </div>
        `;

        return;
    }

    data.girls.forEach(girl => {

        const card =
            document.createElement("div");

        card.className = "girl";

        let historyHTML = "";

        if (girl.history.length === 0) {

            historyHTML = `
                <p>
                    Todavía no hay movimientos.
                </p>
            `;

        } else {

            historyHTML =
                girl.history
                .map(item => {

                    const positive =
                        item.points > 0;

                    const sign =
                        positive ? "+" : "";

                    const className =
                        positive
                        ? "history-positive"
                        : "history-negative";

                    return `
                        <div class="history-item">

                            <strong class="${className}">
                                ${sign}${item.points} puntos
                            </strong>

                            <br>

                            ${item.description}

                            <br>

                            <small>
                                ${formatDate(item.date)}
                            </small>

                            <br>

                            <button
                                class="delete"
                                onclick="deleteHistoryItem(
                                    ${girl.id},
                                    ${item.id}
                                )"
                            >
                                Eliminar
                            </button>

                        </div>
                    `;

                })
                .join("");
        }

        card.innerHTML = `

            <div class="girl-header">

                <div class="girl-name">
                    👧 ${girl.name}
                </div>

                <button
                    class="delete"
                    onclick="deleteGirl(${girl.id})"
                >
                    Borrar
                </button>

            </div>

            <div class="points">
                ${girl.points} puntos
            </div>

            <div class="actions">

                <button
                    class="positive"
                    onclick="addPoints(
                        ${girl.id},
                        1,
                        'Buen comportamiento'
                    )"
                >
                    ➕ +1
                    <br>
                    Buen comportamiento
                </button>

                <button
                    class="positive"
                    onclick="addPoints(
                        ${girl.id},
                        3,
                        'Muy buen comportamiento'
                    )"
                >
                    ⭐ +3
                    <br>
                    Muy buen comportamiento
                </button>

                <button
                    class="negative"
                    onclick="addPoints(
                        ${girl.id},
                        -1,
                        'Mal comportamiento'
                    )"
                >
                    ➖ −1
                    <br>
                    Mal comportamiento
                </button>

                <button
                    class="negative"
                    onclick="addPoints(
                        ${girl.id},
                        -3,
                        'Comportamiento grave'
                    )"
                >
                    ⚠️ −3
                    <br>
                    Comportamiento grave
                </button>

            </div>

            <div class="history">

                <h3>
                    Historial
                </h3>

                ${historyHTML}

            </div>
        `;

        container.appendChild(card);
    });
}

loadData();

render();
