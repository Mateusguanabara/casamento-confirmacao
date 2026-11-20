
import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// CONFIGURAÇÃO CORRETA DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAVV2WFm5dViE2R1t2SbjMDr3qieubm0Os",
    authDomain: "casamento-confiramacao.firebaseapp.com",
    projectId: "casamento-confiramacao",
    storageBucket: "casamento-confiramacao.firebasestorage.app",
    messagingSenderId: "660519961082",
    appId: "1:660519961082:web:29d7dceb3b31bac993e443"
};

// INICIALIZAÇÃO
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ELEMENTOS DO FORMULÁRIO
const form = document.getElementById("formConfirmacao");
const nomeInput = document.getElementById("nome");
const mensagem = document.getElementById("mensagem");
const botao = form.querySelector('button[type="submit"]');

// CONFIRMAR PRESENÇA
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = nomeInput.value.trim().replace(/\s+/g, " ");

    if (nome.length < 3 || nome.length > 100) {
        mensagem.style.color = "red";
        mensagem.textContent = "Digite um nome válido.";
        return;
    }

    botao.disabled = true;
    mensagem.style.color = "#555";
    mensagem.textContent = "Enviando confirmação...";

    try {
        await addDoc(collection(db, "confirmacoes"), {
            nome: nome,
            criadoEm: serverTimestamp()
        });

        mensagem.style.color = "#287a43";
        mensagem.textContent =
            `Presença confirmada com sucesso, ${nome}!`;

        form.reset();

    } catch (erro) {
        console.error("Erro ao confirmar:", erro);

        mensagem.style.color = "red";
        mensagem.textContent =
            "Não foi possível confirmar. Tente novamente.";

    } finally {
        botao.disabled = false;
    }
});
