# legolang


## notes de version
### 18 avril 2018
_le scroll ne se déclenchait pas sur les questions mais sur toute la fenêtre_

J'ai supprime le test de largeur dans la fonction redimCtnQuestions(). Elle n emarchait plus. Je supprime le scroll sur les questions pour les écrans étroits dans les mediaQueries.

### 13 avril 2018
_En relançant le projet pour les actuFLE (Céline, stagiaire de Martine) je me rends compte que l'impression marche mal._
* l'impression ne marchait plus avec chrome, opere et edge. Un maj de la bibliothèque pdfmake.js a résolu le pb pour chrome et opéra...
* j'en ai profité pour mettre le nom de l'exo, nom utilisateur et date dans l'entete. Les questions qui sont restées sans réponses ne sont plus imprimée. 
