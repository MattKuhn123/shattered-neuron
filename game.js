getPlayerTotalForcesValue = () => Number(getPlayerTotalForcesElement().value);
getPlayerTotalForcesElement = () => document.querySelector("#player-total-forces");

getOpponentTotalForcesValue = () => Number(getOpponentTotalForcesElement().value);
getOpponentTotalForcesElement = () => document.querySelector("#opponent-total-forces");

getPlayerCommitForcesValue = () => Number(getPlayerCommitForcesElement().value);
getPlayerCommitForcesElement = () => document.querySelector("#player-commit-forces");

getOpponentCommitForcesValue = () => Number(getOpponentCommitForcesElement().value);
getOpponentCommitForcesElement = () => document.querySelector("#opponent-commit-forces");

getPlayerVictoriesValue = () => Number(getPlayerVictoriesElement().value);
getPlayerVictoriesElement = () => document.querySelector("#opponent-victories");

getOpponentVictoriesValue = () => Number(getOpponentVictoriesElement().value);
getOpponentVictoriesElement = () => document.querySelector("#opponent-victories");

getOutcomeElement = () => document.querySelector("#outcome");

playerForceCommitmentSubmit = async (event) => {
    event.preventDefault();
    doGameStep(doGameStepAttack());
}

doGameStepAttack = () => {
    return {
        playerVictory: undefined,
        validate: async () => {
            const valid = getPlayerCommitForcesValue() <= getPlayerTotalForcesValue();
            getPlayerCommitForcesElement().setCustomValidity(valid ? "" : "You don't have those forces at your disposal, sir!");
            getPlayerCommitForcesElement().reportValidity();
            return valid;
        },
        gameStep: async () => {
            await doOpponentAction(opponentActionAssignForces());
            this.playerVictory = getPlayerCommitForcesValue() > getOpponentCommitForcesValue();
        },
        post: async () => {
            getOutcomeElement().textContent = this.playerVictory ? "Victory!" : "Defeat!";

            await setValue(getPlayerTotalForcesElement(), `${getPlayerTotalForcesValue() - getPlayerCommitForcesValue()}`);
            await setValue(getOpponentTotalForcesElement(), `${getOpponentTotalForcesValue() - getOpponentCommitForcesValue()}`);
            await setValue(getPlayerCommitForcesElement(), "0");
            await setValue(getOpponentCommitForcesElement(), "0");

            if (this.playerVictory) {
                await setValue(getPlayerVictoriesElement(), `${getPlayerVictoriesValue()+1}`)
            } else {
                await setValue(getOpponentVictoriesElement(), `${getOpponentVictoriesValue()+1}`)
            }
        }
    }
}

setValue = async (element, to) => {
    const color = element.style.color;
    element.style.color = "red";
    return new Promise((resolve) => {
        setTimeout(() => {
            element.style.color = color;
            element.value = to;
            resolve();
        }, 1000);
    })
}

doGameStep = async (gameStep) => {
    if (!(await gameStep.validate())) {
        return;
    }
    
    document.querySelectorAll("input").forEach(x => x.setAttribute("readonly", true));
    document.querySelectorAll("button").forEach(x => x.setAttribute("disabled", true));
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
            const forces = Math.floor(Math.random() * getOpponentTotalForcesValue());
            await setValue(getOpponentCommitForcesElement(), `${forces}`);
        }
    }
}

doOpponentAction = async (action) => {
    return new Promise((resolve) => {
        document.querySelector("#opponent-actions").textContent = action.startText;
        setTimeout(() => {
            document.querySelector("#opponent-actions").textContent = action.readyText;
            setTimeout(async () => {
                document.querySelector("#opponent-actions").textContent = "";
                await action.fn();
                resolve();
            }, 500)
        }, 1000);
    });
}

