import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";

interface SerieEntry {
  jour: string;
  somme_totale: string | undefined;
}

interface Data {
  [key: string]: SerieEntry[];
}

class Fonctions {
  getLabels = (data: Data): string[] => {
    // Utiliser un ensemble pour garantir l'unicité des dates
    const uniqueDatesSet = new Set<string>(
      ([] as string[]).concat(
        ...Object.values(data).map((serie) => serie.map((entry) => entry.jour))
      )
    );

    // Convertir l'ensemble en un tableau et le trier dans l'ordre décroissant
    const result = Array.from(uniqueDatesSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    return result;
  };

  getDateFormat = (data: Data): number[][] => {
    // Utiliser un ensemble pour garantir l'unicité des dates
    const uniqueDatesSet = new Set<string>(
      ([] as string[]).concat(
        ...Object.values(data).map((serie) => serie.map((entry) => entry.jour))
      )
    );

    // Convertir l'ensemble en un tableau et le trier dans l'ordre croissant
    const uniqueDatesArray = Array.from(uniqueDatesSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // Créer le tableau final avec les valeurs de somme_totale
    const result: number[][] = Object.values(data).map((serie) =>
      uniqueDatesArray.map((date) => {
        const entry = serie.find((entry) => entry.jour === date);
        const sommeNonNull: string = entry?.somme_totale!;
        return entry ? parseInt(sommeNonNull, 10) : 0;
      })
    );

    return result;
  };

  generateRandomString(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateIdForTransfer() {
    let date = new Date();
    let id = this.generateRandomString(2);
    let id3 = this.generateRandomString(2);
    let id2 = this.generateRandomString(2);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    let code = day + id3 + "-" + id + id2;

    return code;
  }

  generateIdForEnterprise() {
    let date = new Date();
    let id = this.generateRandomString(2);
    let id3 = this.generateRandomString(2);
    let id2 = this.generateRandomString(2);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    let code = day + id3 + id + year + id2;

    return code;
  }

  validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  getCurrentDate = () => {
    const dateObject = new Date();
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getDate().toString().padStart(2, "0");
    const hours = dateObject.getHours().toString().padStart(2, "0");
    const minutes = dateObject.getMinutes().toString().padStart(2, "0");
    const seconds = dateObject.getSeconds().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };

  formatCurrency = (value: any) => {
    var prix = parseFloat(value);

    return prix.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };

  dateFormatDMY = (dateString: string) => {
    const dateObject = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
    // Convertir la date en une chaîne avec le format "28 déc. 2023"
    const formattedDateString = format(dateObject, "dd MMM yyyy", {
      locale: fr,
    });

    return formattedDateString;
  };

  validatePassword = (password: string) => {
    const regexUpperCase = /[A-Z]/;
    const regexLowerCase = /[a-z]/;
    const regexDigit = /\d/;
    const regexSpecialChar = /[@$!%*?&]/;
    const regexMinLength = /.{8,}/;

    const isValidate =
      regexUpperCase.test(password) &&
      regexLowerCase.test(password) &&
      regexDigit.test(password) &&
      regexSpecialChar.test(password) &&
      regexMinLength.test(password);
    return {
      isValidate: isValidate,
      majuscule: regexUpperCase.test(password),
      minuscule: regexLowerCase.test(password),
      number: regexDigit.test(password),
      specialChar: regexSpecialChar.test(password),
      minLength: regexMinLength.test(password),
    };
  };

  ifSameTransferList = (liste1: any, liste2: any) => {
    // Vérifier si les deux listes ont la même longueur
    if (liste1.length !== liste2.length) {
      return false;
    }

    // Comparer chaque élément des deux listes
    for (let i = 0; i < liste1.length; i++) {
      // Comparer les propriétés "user" et "id"
      if (liste1[i].id_transfert !== liste2[i].id_transfert) {
        return false;
      }
    }
    // Si toutes les comparaisons sont réussies, les listes sont égales
    return true;
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Fonctions();
