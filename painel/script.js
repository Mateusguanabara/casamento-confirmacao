
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAVV2WFm5dViE2R1t2SbjMDr3qieubm0Os",
    authDomain: "casamento-confiramacao.firebaseapp.com",
    projectId: "casamento-confiramacao",
    storageBucket: "casamento-confiramacao.firebasestorage.app",
    messagingSenderId: "660519961082",
    appId: "1:660519961082:web:29d7dceb3b31bac993e443"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ELEMENTOS DO HTML
const login = document.getElementById("login");
const painel = document.getElementById("painel");
const formLogin = document.getElementById("form-login");
const erroLogin = document.getElementById("erro-login");
const botaoSair = document.getElementById("sair");

const total = document.getElementById("total");
const lista = document.getElementById("lista-convidados");
const mensagemLista = document.getElementById("mensagem-lista");

let pararEscuta = null;

// LOGIN
formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    erroLogin.textContent = "";

    try {
        await signInWithEmailAndPassword(auth, email, senha);
        formLogin.reset();
    } catch (erro) {
        console.error("Erro no login:", erro.code);
        erroLogin.textContent = "E-mail ou senha inválidos.";
    }
});

// VERIFICAR SE O USUÁRIO ESTÁ LOGADO
onAuthStateChanged(auth, (usuario) => {
    if (pararEscuta) {
        pararEscuta();
        pararEscuta = null;
    }

    if (usuario) {
        login.hidden = true;
        painel.hidden = false;

        carregarConfirmacoes();
    } else {
        login.hidden = false;
        painel.hidden = true;

        lista.replaceChildren();
        total.textContent = "0";
    }
});

// BUSCAR CONFIRMAÇÕES
function carregarConfirmacoes() {
    mensagemLista.textContent = "Carregando confirmações...";

    const consulta = query(
        collection(db, "confirmacoes"),
        orderBy("criadoEm", "desc")
    );

    pararEscuta = onSnapshot(
        consulta,
        (resultado) => {
            lista.replaceChildren();
            total.textContent = resultado.size;

            if (resultado.empty) {
                mensagemLista.textContent = "Nenhuma confirmação ainda.";
                return;
            }

            mensagemLista.textContent = "";

            resultado.forEach((documento) => {
                const dados = documento.data();

                const item = document.createElement("li");
                const nome = document.createElement("strong");
                const data = document.createElement("small");

                nome.textContent = dados.nome || "Sem nome";

                if (dados.criadoEm?.toDate) {
                    data.textContent = dados.criadoEm.toDate()
                        .toLocaleString("pt-BR");
                }

                item.append(nome, data);
                lista.appendChild(item);
            });
        },
        (erro) => {
            console.error("Erro ao buscar confirmações:", erro);
            mensagemLista.textContent =
                "Não foi possível carregar as confirmações.";
        }
    );
}

// SAIR DO PAINEL
botaoSair.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (erro) {
        console.error("Erro ao sair:", erro);
        alert("Não foi possível sair. Tente novamente.");
    }
});
