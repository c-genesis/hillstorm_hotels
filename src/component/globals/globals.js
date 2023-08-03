export const PHONE_REG_EXP = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
export const ONLY_NUMBERS_REG_EXP = /^\d+$/
export const EMAIL_REG_EXP = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/


Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export function getDatesRange(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}


export const NIGERIAN_STATES_AND_CITIES = [
    {
        state: 'Abia',
        cities: [
            'Aba', 'Abiriba', 'Amaeke', 'Arochukwu', 'Bende', 'Igbere', 
            'Nbawsi', 'Ohafia', 'Omoba', 'Ovim', 'Umuahia', 'Umudike'
        ]
    },
    {
        state: 'Adamawa',
        cities: [
            'Ganye', 'Gombi', 'Guyuk', 'Jimeta', 'Mayo-Belwa', 'Michika', 'Mubi', 'Numan', 'Yola',
        ]
    },
    {
        state: 'Akwa Ibom',
        cities: [
            'Eket', 'Etinan', 'Ibeno', 'Ibiono-Ibom', 'Ikot Abasi', 
            'Ikot Ekpene', 'Itu', 'Mkpat-Enin', 'Nsitubom', 'Oron', 'Ukanafun', 'Uyo',
        ]
    },
    {
        state: 'Anambra',
        cities: [
            'Abagana', 'Abba', 'Adazi Ani', 'Adazi Enu', 'Adazi Nnukwu', 
            'Aguleri', 'Agulu', 'Alor', 'Amaokpala', 'Amawbia', 'Atani', 
            'Awka', 'Awka-Etiti', 'Awkuzu', 'Ekwulobia', 'Enugwu-Agidi', 
            'Enugwu-Ukwu', 'Ichida', 'Igbo-Ukwu', 'Ihiala', 'Isuofia', 'Nanka', 
            'Nawfia', 'Nawgu', 'Neni', 'Nibo', 'Nkpor', 'Nnewi', 'Nnobi', 'Oba', 
            'Obosi', 'Ogidi', 'Okija', 'Oko', 'Onitsha', 'Oraifite', 'Otuocha', 
            'Ozubulu', 'Ukpo', 'Umuchu', 'Umudioka', 'Umuleri', 'Umunnachi', 'Umunya', 'Unubi',,
        ]
    },
    {
        state: 'Bauchi',
        cities: [
            'Alkaleri', 'Azare', 'Bauchi', 'Dass', 'Jamaare', 'Misau', 'Ningi', 'Tafawa-Belawa',
        ]
    },
    {
        state: 'Bayelsa',
        cities: [
            'Amasoma', 'Brass', 'Kaiama', 'Koluama', 'Nembe', 
            'Ogbia', 'Oloibiri', 'Opokuma', 'Oporama', 'Sagbama', 'Yenagoa'
        ]
    },
    {
        state: 'Benue',
        cities: [
            'Gboko', 'Katsina-ala', 'Obi', 'Otukpa', 'Otukpo', 'Ugbokolo', 'Vandeikya', 'Makurdi'           
        ]
    },
    {
        state: 'Borno',
        cities: [
            'Biu', 'Chibok', 'Damboa', 'Konduga', 'Maiduguri'
        ]
    },
    {
        state: 'Cross River', 
        cities: [
            'Akamkpa', 'Akpabuyo', 'Bakassi', 'Biase', 'Ikom', 'Obanliku', 
            'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Ugep', 'Yakurr', 'Calabar'
        ]
    },
    {
        state: 'Delta',
        cities: [
            'Warri', 'Abraka', 'Agbor', 'Burutu', 'Effurun', 'Koko', 
            'Kwale', 'Oghara', 'Ogwashi Ukwu', 'Okuokoko', 'Oleh', 'Ovwian', 
            'Ozoro', 'Sapele', 'Ughelli', 'Asaba'
        ]
    },
    {
        state: 'Ebonyi',
        cities: [
            'Abakaliki', 'Afikpo', 'Amasiri', 'Edda', 'Ikwo', 
            'Ishiagu', 'Nkalagu', 'Okposi', 'Onicha', 'Onueke', 'Uburu', 'Unwana',            
        ]
    },
    {
        state: 'Edo',
        cities: [
            'Abudu', 'Afuze', 'Auchi', 'Benin City', 'Ekpoma', 'Ewu', 'Fugar', 
            'Ibillo', 'Igarra', 'Igueben', 'Irrua', 'Okpella', 'Sabongida-Ora', 
            'Ubiaja', 'Urhonigbe', 'Uromi', 'Uzebba',            
        ]
    },
    {
        state: 'Ekiti',
        cities: [
            'Ado Ekiti', 'Afao', 'Aisegba', 'Aramoko-Ekiti', 'Ayedun', 'Efon', 
            'Emure', 'Erinmope', 'Ido', 'Igede', 'Ijero', 'Ikere', 
            'Ikole', 'Ilawe', 'Ise', 'Iye', 'Iyin', 'Ode', 'Odo-Oro', 'Ogotun', 
            'Okemesi', 'Omuo', 'Otun', 'Oye-Ekiti',
        ]
    },
    {
        state: 'Enugu',
        cities: [
            '9th Mile Corner', 'Abor', 'Achi', 'Agbogugu', 'Agbudu', 'Akegbe Ugwu', 
            'Akpugo', 'Akwuke', 'Amagunze', 'Amechi', 'Amechi Idodo', 'Amodu', 
            'Amokwe', 'Amoli', 'Amuri', 'Aninri', 'Awgu', 'Eha-Amufu', 'Eke', 
            'Emene', 'Ezeagu', 'Enugu', 'Ihe', 'Isu Awaa', 'Ituku', 'Lejja', 'Mgbowo', 
            'Mpu', 'Nara', 'Nenwe', 'Ngwo', 'Nike', 'Nkanu', 'Nkerefi', 'Nsukka', 
            'Obe', 'Oduma', 'Ogbaku', 'OgboduAba', 'Oji River', 'Okpanku', 'Okpatu', 
            'Opi', 'Ozalla', 'Udenu', 'Udi', 'Ugbawka', 'Ugbo', 'Ugwuaji', 'Ugwuoba', 
            'Umana', 'Uzouwani', 'lnyi'
        ]
    },
    {
        state: 'Gombe',
        cities: [
            'Bajoga', 'Billiri', 'Dukku', 'Kaltungo', 'Gombe'
        ]
    },
    {
        state: 'Imo',
        cities: [
            'Amaimo', 'Emekuku', 'Etiti', 'Ideato', 'Ihiagwa', 'Owerri', 'Mbaise', 
            'Mgbidi', 'Nkwerre', 'Obowu', 'Oguta', 'Okigwe', 'Orlu', 'Umudim', 'Uzoagba',

        ]
    },
    {
        state: 'Jigawa',
        cities: [
            'Birnin Kudu', 'Gumel', 'Hadejia', 'Kazaure', 'Ringim', 'Dutse'
        ]
    },
    {
        state: 'Kaduna',
        cities: [
            'Kachia', 'Kaduna', 'Kafanchan', 'Kagoro', 'Zaria', 'Zonkwa',
        ]
    },
    {
        state: 'Kano',
        cities: [
            'Dala', 'Dambatta', 'Garzo', 'Gwale', 'Gwarzo', 'Hotoro', 'Kabuga', 'Karaye', 'Nassarawa',
            'Kano'
        ]
    },
    {
        state: 'Katsina',
        cities: [
            'Bakori', 'Batagarawa', 'Daura', 'Funtua', 'Jibia', 'Kankia', 'Zango',, 'Kastina',
        ]
    },
    {
        state: 'Kebbi',
        cities: [
            'Argungu', 'Bagudo', 'Jega', 'Kamba', 'Koko', 'Yauri', 'Zuru', 'Birnin Kebbi'
        ]
    },
    {
        state: 'Kogi', 
        cities: [
            'Ankpa', 'Anyigba', 'Dekina', 'Egbe', 'Idah', 'Itakpe', 'Kabba', 'Lokoja', 'Koton-karfe', 'Okene',
        ]
    },
    {
        state: 'Kwara',
        cities: [
            'Afon', 'Ajasse-Ipo', 'Buari', 'Edidi', 'Erin-lIe', 'Esie', 'Gure', 'Igbaja', 'Ilorin',
            'Jebba', 'Kaiama', 'Lafiagi', 'Offa', 'Oke-Onigbin', 'Omu-Aran', 'Osi', 'Patigi', 
            'lIoffa', 'lIota',
        ]
    },
    {
        state: 'Lagos',
        cities: [
            'Agege', 'Badagry', 'City of Lagos', 'Epe', 'Ikeja', 'Ikorodu', 'Lekki', 'Mushin', 'Ojo',            
        ]
    },
    {
        state: 'Nasarawa',
        cities: [
            'Akwanga', 'Doma', 'Eggon', 'Karu', 'Keffi', 'Lafia', 'Wamba',
        ]
    },
    {
        state: 'Niger',
        cities: [
            'Bida', 'Kotangora', 'Lapai', 'Minna', 'Mokwa', 'Suleja', 'Zungeru',
        ]        
    },
    {
        state: 'Ogun',
        cities: [
            'Ago-Iwoye', 'Ayetoro', 'Ifo', 'Sagamu', 'Sango Ota', 'Abeokuta', 'Agbara', 
            'Ajebo', 'Arepo', 'Ibafo', 'Ibese', 'Iboro', 'Igbesa', 'Igbogila', 
            'Ijebu Ife', 'Ijebu Itele', 'Ijebu Ode', 'Ijebu-Igbo', 'Ijoko', 
            'Ikenne Remo', 'Ilaro', 'Imeko', 'Iperin', 'Iperu Remo', 'Isara-Remo', 
            'Itori', 'Magboro', 'Mowe', 'Ode-Remo', 'Ofada', 'Ogijo', 'Owode',
        ]
    },
    {
        state: 'Ondo',
        cities: [
            'Akungba', 'Akure', 'Arigidi-Akoko', 'Ifon', 'Ijare', 'Ikare', 'Ikare-Akoko', 
            'Ilara-Mokin', 'Ile-Oluji', 'Irele', 'Oka-Akoko', 'Okitipupa', 'Ondo Town', 'Ore', 'Owo',
        ]
    },
    {
        state: 'Osun',
        cities: [
            'Ede', 'Ejigbo', 'Esa-Oke', 'Ikire', 'Ila Orangun', 'Ile-Ife', 'Ilesa', 'Ilobu', 
            'Iwo', 'Oke-Ila Orangun', 'Oshogbo',
        ]
    },
    {
        state: 'Oyo',
        cities: [
            'Ado-Awaye', 'Ago-Amodu', 'Akanran', 'Egbeda', 'Eruwa', 'Fiditi', 
            'Idi Ayunre', 'Igangan', 'Igbo-Ora', 'Igboho', 'Ilora', 'Iresa Adu', 
            'Iseyin', 'Kisi', 'Lalupon', 'Lanlate', 'Ogbomosho', 'Okeho', 'Oyo', 'Saki', 'Ibadan'
        ]
    },
    {
        state: 'Plateau',
        cities: [
            'Barkin Ladi', 'Bukuru', 'Langtang', 'Pankshin', 'Shendam', 'Vom', 'Jos'
        ]
    },
    {
        state: 'Rivers',
        cities: [
            'Abonnema', 'Abua-Odual', 'Ahoada', 'Bane', 'Bonny', 'Bori', 'Buguma', 'Degema', 'Elele', 'Eleme', 
            'Gokana', 'Igrita', 'Ikwerre', 'Obio Akpor', 'Okrika', 'Omoku', 'Onne', 'Opobo', 'Oyigbo',
            'Port Harcourt', 'Rumuokoro',
        ]
    },
    {
        state: 'Sokoto',
        cities: [
            'Bodinga', 'Gada', 'Gwadabawa', 'Ilela', 'Sokoto', 'Tambulwal', 'Wamakko', 'Wurno', 'Yabo',            
        ]
    },
    {
        state: 'Taraba',
        cities: [
            'Bali', 'Gashaka', 'Ibi', 'Jalingo', 'Kurmi', 'Sardauna', 'Takun', 'Wukari', 'Zing',
        ]
    },
    {
        state: 'Yobe',
        cities: [
            'Damaturu', 'Gashua', 'Giedam', 'Nguru', 'Potiskum',
        ]
    },
    {
        state: 'Zamfara',
        cities: [
            'Anka', 'Bakura', 'Bungudu', 'Gummi', 'Kaura', 'Namoda Maradun', 'Maru', 'Shinkafi', 
            'Talata-Mafara', 'Tsafe', 'Zurmi',
        ]
    }
]