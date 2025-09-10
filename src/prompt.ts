// export function createLoginPrompt(dom: string, email: string, password: string): string {
//   return `
// Tu es un agent IA de test E2E.
// Voici une page HTML contenant un formulaire de connexion.

// Identifiants à utiliser :
// - Email : ${email}
// - Mot de passe : ${password}

// Analyse le DOM suivant et renvoie une liste d’actions au format JSON pour remplir les champs et soumettre le formulaire.

// DOM :
// ${dom}

// Réponds avec un JSON comme ceci :
// [
//   { "type": "fill", "selector": "input[name='email']", "value": "test@example.com" },
//   { "type": "fill", "selector": "input[name='password']", "value": "secret123" },
//   { "type": "click", "selector": "button[type='submit']" }
// ]
// `;
// }

// export function createLoginPrompt(dom: string, email: string, password: string): string {
//   return `
// Tu es un agent E2E intelligent. Tu interagis avec une interface utilisateur pour connecter un utilisateur.

// Voici le **but à atteindre** :
// 1. Cliquer sur le bouton qui ouvre le drawer de connexion (souvent un bouton avec une icône "compte", "utilisateur" ou "connexion")
// 2. Remplir le champ email avec : ${email}
// 3. Cliquer sur le bouton pour continuer ou valider l’email
// 4. Remplir le champ mot de passe avec : ${password}
// 5. Cliquer sur le bouton pour se connecter

// **Consignes importantes** :
// - Lis bien le HTML fourni.
// - N’invente rien. Base-toi sur les "placeholder", "aria-label", "text", "name", "id" ou "class".
// - Utilise des sélecteurs CSS valides.
// - Réponds uniquement en JSON. Ne donne aucun commentaire.
// - Si plusieurs boutons sont possibles, choisis le plus probable.
// - Tu peux utiliser "text=" comme sélecteur si un bouton a un texte visible.

// Voici le DOM à analyser (tronqué à 7000 caractères max) :

// ${dom.slice(0, 7000)}

// Réponds avec un tableau JSON d’actions à exécuter, comme ceci :
// [
//   { "type": "click", "selector": "button[aria-label='Se connecter']" },
//   { "type": "fill", "selector": "input[name='email']", "value": "${email}" },
//   { "type": "click", "selector": "button:text('Continuer')" },
//   { "type": "fill", "selector": "input[name='password']", "value": "${password}" },
//   { "type": "click", "selector": "button:text('Connexion')" }
// ]
// `;
// }

// export function createLoginPrompt(dom: string, email: string, password: string): string {
//   return `
// Tu es un agent E2E intelligent. Tu interagis avec une interface utilisateur pour connecter un utilisateur.

// Voici le **but à atteindre** :
// 1. Cliquer sur le bouton, dont le texte est "Accepter & Fermer", qui se trouve dans la modal de cookies, au la page.
// 2. Cliquer sur le bouton qui ouvre le drawer de connexion (souvent un bouton avec une icône ou un aria-label "My Account")
// 3. Remplir le champ email dont l'id ou le name est "email" avec : ${email}
// 4. Cliquer sur le bouton pour continuer
// 5. Remplir le champ mot de passe dont l'id ou le name ou le type est "password" avec : ${password}
// 6. Cliquer sur le bouton pour se connecter

// **Consignes importantes** :
// - Lis bien le HTML fourni.
// - N’invente rien. Base-toi sur les "placeholder", "aria-label", "text", "name", "id", "class" ou "type".
// - Utilise des sélecteurs CSS valides.
// - Réponds uniquement en JSON. Ne donne aucun commentaire.
// - Si plusieurs boutons sont possibles, choisis le premier.
// - Tu peux utiliser "text=" comme sélecteur si un bouton a un texte visible.

// Voici le DOM à analyser :
// ${dom}

// Réponds avec un tableau JSON d’actions à exécuter, comme ceci :
// [
//   { "type": "click", "selector": "button[aria-label='Se connecter']" },
//   { "type": "fill", "selector": "input[name='email']", "value": "${email}" },
//   { "type": "click", "selector": "button:text('Continuer')" },
//   { "type": "fill", "selector": "input[name='password']", "value": "${password}" },
//   { "type": "click", "selector": "button:text('Connexion')" }
// ]
// `;
// }

export const createLoginPrompt = (dom: string): string => {
  return `
    Tu es un agent E2E intelligent. Tu interagis avec une interface utilisateur pour accepter les cookies.

    Voici le **but à atteindre** :
      1. Cliquer sur le bouton, dont le texte est "Accepter & Fermer", qui se trouve dans la modal de cookies, au la page.

    **Consignes importantes** :
      - Lis bien le HTML fourni.
      - N’invente rien. Base-toi sur les "placeholder", "aria-label", "text", "name", "id", "class" ou "type".
      - Utilise des sélecteurs CSS valides.
      - Réponds uniquement en JSON. Ne donne aucun commentaire.
      - Si plusieurs boutons sont possibles, choisis le premier.
      - Tu peux utiliser "text=" comme sélecteur si un bouton a un texte visible.

    Voici le DOM à analyser :
      ${dom}

    Réponds avec un tableau JSON d’actions à exécuter, comme ceci :
      [
        { "type": "click", "selector": "button[aria-label='Accepter & Fermer']" },
      ]
  `;
}
