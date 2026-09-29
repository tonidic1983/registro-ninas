const STORAGE_KEY = "mis_puntos_v2";

let data = {
    girls: [],
    behaviors: [
        {
            id: 1,
            name: "Buen comportamiento",
            points: 1,
            type: "positive"
        },
        {
            id: 2,
            name: "Muy buen comportamiento",
            points: 3,
            type: "positive"
        },
        {
            id: 3,
            name: "Mal comportamiento",
            points: -1,
            type: "negative"
        },
        {
            id: 4,
            name: "Comportamiento grave",
            points: -3,
            type: "negative"
        }
    ],
    rewards: []
};


/* =========================
   CARGAR DATOS
========================= */

function loadData() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (saved) {

        try {

            const savedData =
                JSON.parse(saved);

            data = {
                girls: savedData.girls || [],
                behaviors:
                    savedData.behaviors ||
                    data.behaviors,
                rewards:
                    savedData.rewards || []
            };

        } catch (error) {

            console.error(
                "Error cargando datos:",
                error
            );

        }
    }
}


/* =========================
   GUARDAR DATOS
========================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* =========================
   NIÑAS
========================= */

function addGirl() {

    const name =
        prompt("Nombre de la niña:");

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


function deleteGirl(girlId) {

    const girl =
        data.girls.find(
            girl => girl.id === girlId
        );

    if (!girl) {
        return;
    }

    const confirmation =
        confirm(
            `¿Quieres borrar a ${girl.name} y todo su historial?`
        );

    if (!confirmation) {
        return;
    }

    data.girls =
        data.girls.filter(
            girl => girl.id !== girlId
        );

    saveData();

    render();
}


/* =========================
   PUNTOS
========================= */

function addPoints(
    girlId,
    points,
    description
) {

    const girl =
        data.girls.find(
            girl => girl.id === girlId
        );

    if (!girl) {
        return;
    }

    girl.points += points;

    girl.history.unshift({

        id: Date.now(),

        date:
            new Date().toISOString(),

        points: points,

        description: description

    });

    saveData();

    render();
}


/* =========================
   ELIMINAR MOVIMIENTO
========================= */

function deleteHistoryItem(
    girlId,
    historyId
) {

    const girl =
        data.girls.find(
            girl => girl.id === girlId
        );

    if (!girl) {
        return;
    }

    const item =
        girl.history.find(
            item => item.id === historyId
        );

    if (!item) {
        return;
    }

    const confirmation =
        confirm(
            "¿Eliminar este movimiento?"
        );

    if (!confirmation) {
        return;
    }

    girl.points -= item.points;

    girl.history =
        girl.history.filter(
            item => item.id !== historyId
        );

    saveData();

    render();
}


/* =========================
   COMPORTAMIENTOS
========================= */

function addBehavior() {

    const name =
        prompt(
            "Nombre del comportamiento:"
        );

    if (!name || !name.trim()) {
        return;
    }

    const pointsInput =
        prompt(
            "¿Cuántos puntos?\n\n" +
            "Ejemplo: 2 para sumar 2 puntos.\n" +
            "Ejemplo: -2 para restar 2 puntos."
        );

    const points =
        Number(pointsInput);

    if (
        !Number.isFinite(points) ||
        points === 0
    ) {

        alert(
            "Introduce un número distinto de 0."
        );

        return;
    }

    data.behaviors.push({

        id: Date.now(),

        name: name.trim(),

        points: points,

        type:
            points > 0
            ? "positive"
            : "negative"

    });

    saveData();

    renderSettings();
}


function editBehavior(id) {

    const behavior =
        data.behaviors.find(
            behavior => behavior.id === id
        );

    if (!behavior) {
        return;
    }

    const newName =
        prompt(
            "Nombre:",
            behavior.name
        );

    if (!newName || !newName.trim()) {
        return;
    }

    const newPointsInput =
        prompt(
            "Puntos:",
            behavior.points
        );

    const newPoints =
        Number(newPointsInput);

    if (
        !Number.isFinite(newPoints) ||
        newPoints === 0
    ) {

        alert(
            "Los puntos deben ser un número distinto de 0."
        );

        return;
    }

    behavior.name =
        newName.trim();

    behavior.points =
        newPoints;

    behavior.type =
        newPoints > 0
        ? "positive"
        : "negative";

    saveData();

    renderSettings();
}


function deleteBehavior(id) {

    const behavior =
        data.behaviors.find(
            behavior => behavior.id === id
        );

    if (!behavior) {
        return;
    }

    const confirmation =
        confirm(
            `¿Eliminar "${behavior.name}"?`
        );

    if (!confirmation) {
        return;
    }

    data.behaviors =
        data.behaviors.filter(
            behavior => behavior.id !== id
        );

    saveData();

    renderSettings();
}


/* =========================
   RECOMPENSAS
========================= */

function addReward() {

    const name =
        prompt(
            "Nombre de la recompensa:"
        );

    if (!name || !name.trim()) {
        return;
    }

    const pointsInput =
        prompt(
            "¿Cuántos puntos hacen falta?"
        );

    const points =
        Number(pointsInput);

    if (
        !Number.isFinite(points) ||
        points <= 0
    ) {

        alert(
            "Introduce una cantidad positiva."
        );

        return;
    }

    data.rewards.push({

        id: Date.now(),

        name: name.trim(),

        points: points

    });

    saveData();

    renderSettings();
}


function editReward(id) {

    const reward =
        data.rewards.find(
            reward => reward.id === id
        );

    if (!reward) {
        return;
    }

    const newName =
        prompt(
            "Nombre:",
            reward.name
        );

    if (!newName || !newName.trim()) {
        return;
    }

    const newPointsInput =
        prompt(
            "Puntos necesarios:",
            reward.points
        );

    const newPoints =
        Number(newPointsInput);

    if (
        !Number.isFinite(newPoints) ||
        newPoints <= 0
    ) {

        alert(
            "Introduce una cantidad positiva."
        );

        return;
    }

    reward.name =
        newName.trim();

    reward.points =
        newPoints;

    saveData();

    renderSettings();
}


function deleteReward(id) {

    const confirmation =
        confirm(
            "¿Eliminar esta recompensa?"
        );

    if (!confirmation) {
        return;
    }

    data.rewards =
        data.rewards.filter(
            reward => reward.id !== id
        );

    saveData();

    renderSettings();
}


/* =========================
   CONFIGURACIÓN
========================= */

function openSettings() {

    document
        .getElementById("girlsSection")
        .classList.add("hidden");

    document
        .getElementById("settingsSection")
        .classList.remove("hidden");

    renderSettings();
}


function closeSettings() {

    document
        .getElementById("settingsSection")
        .classList.add("hidden");

    document
        .getElementById("girlsSection")
        .classList.remove("hidden");

    render();
}


/* =========================
   RENDER CONFIGURACIÓN
========================= */

function renderSettings() {

    const behaviorsContainer =
        document.getElementById(
            "behaviors"
        );

    const rewardsContainer =
        document.getElementById(
            "rewards"
        );


    behaviorsContainer.innerHTML =
        data.behaviors
            .map(behavior => {

                const sign =
                    behavior.points > 0
                    ? "+"
                    : "";

                return `

                    <div class="behavior-item">

                        <div class="behavior-info">

                            <div class="behavior-name">
                                ${escapeHTML(
                                    behavior.name
                                )}
                            </div>

                            <div class="behavior-points">
                                ${sign}${behavior.points} puntos
                            </div>

                        </div>

                        <div class="item-buttons">

                            <button
                                class="edit-button"
                                onclick="editBehavior(
                                    ${behavior.id}
                                )"
                            >
                                ✏️
                            </button>

                            <button
                                class="delete-button"
                                onclick="deleteBehavior(
                                    ${behavior.id}
                                )"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");


    if (data.rewards.length === 0) {

        rewardsContainer.innerHTML =
            "<p>No hay recompensas todavía.</p>";

    } else {

        rewardsContainer.innerHTML =
            data.rewards
                .map(reward => {

                    return `

                        <div class="reward-item">

                            <div class="reward-info">

                                <div class="reward-name">
                                    🎁 ${escapeHTML(
                                        reward.name
                                    )}
                                </div>

                                <div class="reward-points">
                                    ${reward.points} puntos
                                </div>

                            </div>

                            <div class="item-buttons">

                                <button
                                    class="edit-button"
                                    onclick="editReward(
                                        ${reward.id}
                                    )"
                                >
                                    ✏️
                                </button>

                                <button
                                    class="delete-button"
                                    onclick="deleteReward(
                                        ${reward.id}
                                    )"
                                >
                                    🗑️
                                </button>

                            </div>

                        </div>

                    `;

                })
                .join("");
    }
}


/* =========================
   RENDER PRINCIPAL
========================= */

function render() {

    const container =
        document.getElementById(
            "girls"
        );

    container.innerHTML = "";


    if (data.girls.length === 0) {

        container.innerHTML = `

            <div class="girl">

                <p>
                    Todavía no has añadido
                    ninguna niña.
                </p>

                <button
                    class="small-button"
                    onclick="addGirl()"
                >
                    + Añadir niña
                </button>

            </div>

        `;

        return;
    }


    data.girls.forEach(girl => {

        const card =
            document.createElement("div");

        card.className = "girl";


        const positiveBehaviors =
            data.behaviors.filter(
                behavior =>
                    behavior.points > 0
            );


        const negativeBehaviors =
            data.behaviors.filter(
                behavior =>
                    behavior.points < 0
            );


        let actionsHTML = "";


        positiveBehaviors.forEach(
            behavior => {

                actionsHTML += `

                    <button
                        class="positive"
                        onclick="addPoints(
                            ${girl.id},
                            ${behavior.points},
                            '${escapeJS(
                                behavior.name
                            )}'
                        )"
                    >

                        ➕
                        ${escapeHTML(
                            behavior.name
                        )}

                        <br>

                        +${behavior.points}

                    </button>

                `;

            }
        );


        negativeBehaviors.forEach(
            behavior => {

                actionsHTML += `

                    <button
                        class="negative"
                        onclick="addPoints(
                            ${girl.id},
                            ${behavior.points},
                            '${escapeJS(
                                behavior.name
                            )}'
                        )"
                    >

                        ➖
                        ${escapeHTML(
                            behavior.name
                        )}

                        <br>

                        ${behavior.points}

                    </button>

                `;

            }
        );


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
                            positive
                            ? "+"
                            : "";

                        const className =
                            positive
                            ? "history-positive"
                            : "history-negative";


                        return `

                            <div
                                class="history-item"
                            >

                                <strong
                                    class="${className}"
                                >
                                    ${sign}${item.points}
                                    puntos
                                </strong>

                                <br>

                                ${escapeHTML(
                                    item.description
                                )}

                                <br>

                                <small>
                                    ${formatDate(
                                        item.date
                                    )}
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


        const rewardsHTML =
            renderGirlRewards(girl);


        card.innerHTML = `

            <div class="girl-header">

                <div class="girl-name">
                    👧 ${escapeHTML(
                        girl.name
                    )}
                </div>

                <button
                    class="delete"
                    onclick="deleteGirl(
                        ${girl.id}
                    )"
                >
                    Borrar
                </button>

            </div>


            <div class="points">

                ${girl.points}

                <div
                    style="
                        font-size:14px;
                        font-weight:500;
                        color:#777;
                    "
                >
                    puntos
                </div>

            </div>


            <div class="actions">

                ${actionsHTML}

            </div>


            ${
                rewardsHTML
            }


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


/* =========================
   RECOMPENSAS DE CADA NIÑA
========================= */

function renderGirlRewards(girl) {

    if (data.rewards.length === 0) {
        return "";
    }


    const available =
        data.rewards.filter(
            reward =>
                girl.points >= reward.points
        );


    let html = `

        <div
            style="
                margin-top:20px;
                padding-top:15px;
                border-top:1px solid #eee;
            "
        >

            <h3>
                🎁 Recompensas
            </h3>

    `;


    data.rewards.forEach(reward => {

        const canClaim =
            girl.points >= reward.points;


        if (canClaim) {

            html += `

                <button
                    style="
                        width:100%;
                        background:#fff3cd;
                        margin-bottom:8px;
                    "
                    onclick="claimReward(
                        ${girl.id},
                        ${reward.id}
                    )"
                >

                    🎁
                    ${escapeHTML(
                        reward.name
                    )}

                    —
                    ${reward.points} puntos

                </button>

            `;

        } else {

            html += `

                <div
                    style="
                        padding:8px 0;
                        color:#777;
                        font-size:14px;
                    "
                >

                    🔒
                    ${escapeHTML(
                        reward.name
                    )}

                    —
                    ${reward.points} puntos

                </div>

            `;

        }

    });


    html += "</div>";

    return html;
}


function claimReward(
    girlId,
    rewardId
) {

    const girl =
        data.girls.find(
            girl => girl.id === girlId
        );

    const reward =
        data.rewards.find(
            reward => reward.id === rewardId
        );


    if (!girl || !reward) {
        return;
    }


    if (
        girl.points <
        reward.points
    ) {

        return;
    }


    const confirmation =
        confirm(
            `¿Canjear "${reward.name}" por ${reward.points} puntos?`
        );


    if (!confirmation) {
        return;
    }


    girl.points -= reward.points;


    girl.history.unshift({

        id: Date.now(),

        date:
            new Date().toISOString(),

        points:
            -reward.points,

        description:
            `🎁 Recompensa: ${reward.name}`

    });


    saveData();

    render();
}


/* =========================
   COPIA DE SEGURIDAD
========================= */

function exportData() {

    const backup =
        JSON.stringify(
            data,
            null,
            2
        );


    const blob =
        new Blob(
            [backup],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "mis-puntos-backup.json";


    link.click();


    URL.revokeObjectURL(
        url
    );
}


function importData() {

    const input =
        document.getElementById(
            "importFile"
        );


    input.value = "";

    input.click();


    input.onchange =
        function(event) {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function(e) {

                    try {

                        const imported =
                            JSON.parse(
                                e.target.result
                            );


                        if (
                            !imported.girls ||
                            !Array.isArray(
                                imported.girls
                            )
                        ) {

                            throw new Error(
                                "Archivo no válido"
                            );

                        }


                        const confirmation =
                            confirm(
                                "Importar esta copia reemplazará los datos actuales. ¿Continuar?"
                            );


                        if (
                            !confirmation
                        ) {

                            return;

                        }


                        data = {

                            girls:
                                imported.girls
                                || [],

                            behaviors:
                                imported.behaviors
                                || [],

                            rewards:
                                imported.rewards
                                || []

                        };


                        saveData();

                        render();

                        alert(
                            "Copia restaurada correctamente."
                        );


                    } catch (error) {

                        alert(
                            "No se ha podido importar la copia."
                        );

                    }

                };


            reader.readAsText(
                file
            );

        };
}


/* =========================
   UTILIDADES
========================= */

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString
        );


    return date.toLocaleString(
        "es-ES",
        {

            day: "2-digit",

            month: "2-digit",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        }
    );
}


function escapeHTML(
    text
) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


function escapeJS(
    text
) {

    return String(text)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        );
}


/* =========================
   INICIO
========================= */

loadData();

render();
