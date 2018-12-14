// JavaScript Document
//**********************//
//**variable globales***//
var tblExo = {}; // le tableau contenant TOUTES les données de l'exo (ouverture directe du fichier .json)
var tblExoSauv = JSON.stringify(tblExo); // chaine de tblExo lors de la dernière sauvegarde
var qCourante = 0;
var nomFichier;
var videoARecharger = false; //pour recharger la fenetre video quand on change l'adresse (sans le faire bourrin à chaque fois et se retrouevr au début de la vidéo dès qu'on change d'onglet

var utilisateurPlus = false;
var affichTitre = false; // pour masquer le titre dans auteur (en fait on l'affiche que dans actuFLE pour le moment...)

var editeur1, editeur2, editeur3, editeur4, editeur5;

var tblAide = {}; /**/

var tblSieges = [];
var siege = 0; //siege affecté à la session : on va utiliser ça pour ecrire et lire les ST

var sauvegardeAuto = 55000; // durée entre deux sauvegarde automatique

var tblClaviers = [{
        "id": "--",
        "car": ""
    },
    {
        "id": "cat",
        "car": "ÀàÉéÈèÍíÏïÓóÒòÚúÜüÇçL·Ll·l"
    },
    {
        "id": "cz",
        "car": "ÁáČčĎďÉéĚěÍíŇňÓóŘřŠšŤťÚúŮůÝýŽž"
    },
    {
        "id": "de",
        "car": "ÄÖÜẞäöüß"
    },
    {
        "id": "es",
        "car": "ÑñÁáÉéÍíÓóÚúÜü¿¡"
    },
    {
        "id": "fr",
        "car": "ÀàÉéÈèÊêëïôöùÆæŒœÇç"
    },
    {
        "id": "is",
        "car": "ÐðÞþÁáÆæÉéÍíÓóÖöÚúÝý"
    },
    {
        "id": "it",
        "car": "ÀàÉéÈèÌìÎîÓóÒòÙù"
    },
    {
        "id": "no",
        "car": "ÅåÆæØø"
    },
    {
        "id": "pl",
        "car": "ĄąĆćĘęŁłŃńÓóŚśŹźŻż"
    },
    {
        "id": "pt",
        "car": "ÀàÃãáÇçÊêÉéíÕõóú"
    }
];


//**********************//
//** fonctions**********//



function affichAide(obj) {
    "use strict";

    if (tblAide[obj.id.split("_")[1]]) {
        $("#ctnPopupAide").html(tblAide[obj.id.split("_")[1]]);
    } else {
        $("#ctnPopupAide").html("--- <br>" + obj.id.split("_")[1]);
    }
    $("#ctnPopupAide").dialog("open");
}

function randomString(length) {
    "use strict";
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function tempsPon2lisible(entree) {
    "use strict";
    var maDate = new Date();
    maDate.setTime(entree);

    var lisible = maDate.toLocaleDateString() + " à " + maDate.toLocaleTimeString();
    return lisible;
}

function eDblQ(entree) {
    "use strict";
    var regExp = /"/g; // pour virer les doubleQuote qui plante le paquet scorm...
    var sortie = entree.replace(regExp, "'");
  // *** pour virer les retour à la ligne généré par tinyMCE... mais pas dans les ST ( :/ )
    if (entree.substr(0, 6) !== "WEBVTT") {
      console.log("en fait entree.substr(0, 5) = " + entree.substr(0, 5));
        regExp = /\n/g;
        sortie = sortie.replace(regExp, "");
    }
    return sortie;
}

function actualiserST() {
    "use strict";

    document.getElementById("fm_ecrit_st").submit();
    var temp = setTimeout(function() {
        chargerVideo();
    }, 1000);
}

function chargerVideo() {
    "use strict";
    //*** media
    if (tblExo.videoType === "0" || !tblExo.videoType) {
        $("#ctnVideo").load("video_html.html", function() {
            $("#video").attr("src", tblExo.videoUrl);
        });
    } else if (tblExo.videoType === "1") {
        $("#ctnVideo").load("video_html.html", function() {
            //$("#video").attr("src",tblExo["videoUrl"]);
            var temp = tblExo.videoUrl.split("/");
            var adresse = temp[0] + "//" + temp[2] + "/public.php?service=files&t=" + temp[temp.length - 1] + "&download";
            // console.log("video OWNCMOUL " + adresse);
            $("#video").attr("src", adresse);
        });
    } else if (tblExo.videoType === "2") {
        $("#ctnVideo").load("video_youtube.html");
    }
    videoARecharger = false;
}

function questionFormat(entree) {
    var re = /<\/div><div>/gi;
    entree = eDblQ(entree.replace(re, "<br>"));
    entree = entree.replace("<div>", "");
    entree = entree.replace("</div>", "");
    return entree;
}
