elt = (id) => {
    return document.getElementById(id);
}

val = (id, value) => {
    const x = elt(id);
    if (value !== undefined) {
        if (x.tagName.toLowerCase() === "input") {
            x.value = value.toString();
        } else {
            x.textContent = value.toString();
        }
    } else {
        if (x.tagName.toLowerCase() === "input") {
            return Number(x.value);
        } else {
            return Number(x.textContent);
        }
    }

}

playerTotalForcesId = () => "player-total-forces";
opponentTotalForcesId = () => "opponent-total-forces";
playerCommitForcesId = () => "player-commit-forces";
opponentCommitForcesId = () => "opponent-commit-forces";
playerVictoriesId = () => "player-victories";
opponentVictoriesId = () => "opponent-victories";
outcomeId = () => "outcome";
opponentActionsId = () => "opponent-actions";

onSubmitPlayerForceCommitment = async (event) => {
    await doGameStep(doGameStepAttack());
}

doGameStepAttack = () => {
    return {
        playerVictory: undefined,
        pre: async () => {
            await doOpponentAction(opponentActionAssignForces());
        },
        gameStep: async () => {
            val(playerTotalForcesId(), val(playerTotalForcesId()) - val(playerCommitForcesId()));
            val(opponentTotalForcesId(), val(opponentTotalForcesId()) - val(opponentCommitForcesId()));
            val(playerCommitForcesId(), 0);
            val(opponentCommitForcesId(), 0);
            
            this.playerVictory = val(playerCommitForcesId()) > val(opponentCommitForcesId());
            if (this.playerVictory) {
                val(playerVictoriesId(), val(playerVictoriesId())+1);
            } else {
                val(opponentVictoriesId(), val(opponentVictoriesId())+1);
            }
        },
        post: async () => {
            val(outcomeId(), this.playerVictory ? "Victory!" : "Defeat!");
        }
    }
}

doGameStep = async (gameStep) => {
    document.querySelectorAll("input").forEach(x => x.setAttribute("readonly", true));
    document.querySelectorAll("button").forEach(x => x.setAttribute("disabled", true));

    await gameStep.pre();
    await gameStep.gameStep();
    await gameStep.post();

    document.querySelectorAll("input").forEach(x => x.removeAttribute("readonly"));
    document.querySelectorAll("button").forEach(x => x.removeAttribute("disabled"));
}

opponentActionAssignForces = () => {
    return {
        startText: "Thinking...",
        readyText: "Ready!",
        fn: async () => {
            const forces = Math.floor(Math.random() * val(opponentTotalForcesId()));
            val(opponentCommitForcesId(), forces);
        }
    }
}

doOpponentAction = async (action) => {
    return new Promise((resolve) => {
        val(opponentActionsId(), action.startText);
        setTimeout(() => {
            val(opponentActionsId(), action.readyText);
            setTimeout(async () => {
                val(opponentActionsId(), "");
                await action.fn();
                resolve();
            }, 500)
        }, 1000);
    });
}

// TODO : can this be used for ui purposes, still?
// setValue = async (element, to) => {
//     const color = element.style.color;
//     element.style.color = "red";
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             element.style.color = color;
//             element.value = to;
//             resolve();
//         }, 1000);
//     })
// }
