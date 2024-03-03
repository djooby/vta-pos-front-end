import { add, format, parse } from "date-fns";
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

  generateId(length: number) {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
      currency: "HTG",
      minimumFractionDigits: 2,
    });
  };

  dateFormatYMDtoDMYFr = (dateString: string) => {
    const dateObject = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
    // Convertir la date en une chaîne avec le format "28 déc. 2023"
    const formattedDateString = format(dateObject, "dd MMM yyyy", {
      locale: fr,
    });

    return formattedDateString;
  };

  dateFormatDMYToDMYFr = (dateString: string) => {
    const dateObject = parse(dateString, "yyyy-MM-dd", new Date());
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

  getInitials(fullName: string): string {
    // Split the full name into parts using space as separator
    const nameParts = fullName.split(" ");

    // Initialize a variable to store initials
    let initials = "";

    // Iterate over the name parts
    for (const part of nameParts) {
      // Check if the part is not empty
      if (part.length > 0) {
        // Add the first letter in uppercase to the initials string
        initials += part[0].toUpperCase();
      }
    }

    // Return the first two initials
    return initials.substring(0, 2);
  }

  add30Days(date: string): string {
    // Ajouter 30 jours à la date de l'API
    const nouvelleDate = add(date, { days: 30 });

    // Formater la nouvelle date dans le même format que la date d'entrée de l'API
    const formatDate = format(nouvelleDate, "yyyy-MM-dd");
    return formatDate;
  }

  convertDateToDMY(date: Date): string {
    return format(date, "yyyy-MM-dd");
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Fonctions();
