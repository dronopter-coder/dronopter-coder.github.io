// Bu dosya scripts/fetch-photos.mts tarafından üretilir; elle düzenlemeyin.
// Fotoğraflar Wikimedia Commons'tandır; her birinin yazarı ve lisansı aşağıdadır.

export type Photo = { image: number; author: string; license: string; url: string };

export const PHOTOS: Record<string, Photo> = {
  'guide:figurinler': {
    image: require('../../assets/photos/guide-figurinler.jpg'),
    author: "Sefer azeri",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:%C3%87atalh%C3%B6y%C3%BCk_oturan_ilah%C9%99_fiqurunun_%C3%B6nd%C9%99n_g%C3%B6r%C3%BCn%C3%BC%C5%9F%C3%BC.jpg",
  },
  'guide:fotograf': {
    image: require('../../assets/photos/guide-fotograf.jpg'),
    author: "Tadeusz Biniewski",
    license: "CC BY-SA 3.0 pl",
    url: "https://commons.wikimedia.org/wiki/File:Excavations_at_Faras_049.jpg",
  },
  'guide:isaretler': {
    image: require('../../assets/photos/guide-isaretler.jpg'),
    author: "Asef-m-m",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Golpayegan.petroglyphs0101.jpg",
  },
  'guide:kandiller': {
    image: require('../../assets/photos/guide-kandiller.jpg'),
    author: "Combirom2",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Group_of_ancient_hellenistic_an_roan_oil_lamps.jpg",
  },
  'guide:muhurler': {
    image: require('../../assets/photos/guide-muhurler.jpg'),
    author: "Wikimedia Commons",
    license: "Public domain",
    url: "https://commons.wikimedia.org/wiki/File:Cylinder_seal_king_Louvre_AO6620.jpg",
  },
  'guide:seramik': {
    image: require('../../assets/photos/guide-seramik.jpg'),
    author: "Ad Meskens",
    license: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:Amphorae_stacking.jpg",
  },
  'guide:sikkeler': {
    image: require('../../assets/photos/guide-sikkeler.jpg'),
    author: "CNG Coins",
    license: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:Kroisos._Circa_564-53-550-39_BC._AV_Stater_(16mm,_10.76_g)._Heavy_series._Sardes_mint.jpg",
  },
  'guide:takilar': {
    image: require('../../assets/photos/guide-takilar.jpg'),
    author: "Anonymous (Frankish) Unknown author",
    license: "Public domain",
    url: "https://commons.wikimedia.org/wiki/File:Frankish_-_Digitated_Fibula_-_Walters_542443.jpg",
  },
  'guide:yasal': {
    image: require('../../assets/photos/guide-yasal.jpg'),
    author: "Metuboy",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Istanbularcheology.jpg",
  },
  'guide:zaman': {
    image: require('../../assets/photos/guide-zaman.jpg'),
    author: "Teomancimit",
    license: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:G%C3%B6bekli_Tepe,_Urfa.jpg",
  },
  'place:hitit': {
    image: require('../../assets/photos/place-hitit.jpg'),
    author: "Carole Raddato from FRANKFURT, Germany",
    license: "CC BY-SA 2.0",
    url: "https://commons.wikimedia.org/wiki/File:Lion_Gate,_Hattusa_13_(cropped).jpg",
  },
  'place:iyonya': {
    image: require('../../assets/photos/place-iyonya.jpg'),
    author: "Benh LIEU SONG",
    license: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:Ephesus_Celsus_Library_Fa%C3%A7ade.jpg",
  },
  'place:kafkas': {
    image: require('../../assets/photos/place-kafkas.jpg'),
    author: "Engin Tavlı",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Ani_Harabeleri_2.jpg",
  },
  'place:kapadokya': {
    image: require('../../assets/photos/place-kapadokya.jpg'),
    author: "MusikAnimal",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:G%C3%B6reme_town_and_valley_2015.JPG",
  },
  'place:karadeniz': {
    image: require('../../assets/photos/place-karadeniz.jpg'),
    author: "Ahmtzngn34",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Ye%C5%9Fil%C4%B1rmak2.jpg",
  },
  'place:karya': {
    image: require('../../assets/photos/place-karya.jpg'),
    author: "Carole Raddato from FRANKFURT, Germany",
    license: "CC BY-SA 2.0",
    url: "https://commons.wikimedia.org/wiki/File:The_Temple_of_Aphrodite,_built_in_the_Ionic_order_in_stages_during_the_Roman_period_(from_1st_century_BC_to_2nd_century_AD)_and_later_converted_into_a_Christian_basilica,_Aphrodisias,_Caria,_Turkey_(20300922019).jpg",
  },
  'place:kommagene': {
    image: require('../../assets/photos/place-kommagene.jpg'),
    author: "Klearchos Kapoutsis from Santorini, Greece",
    license: "CC BY 2.0",
    url: "https://commons.wikimedia.org/wiki/File:Mount_Nemrut_-_East_Terrace_(4961323529).jpg",
  },
  'place:konya': {
    image: require('../../assets/photos/place-konya.jpg'),
    author: "Murat Özsoy 1958",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:%C3%87atalh%C3%B6y%C3%BCk,_7400_BC,_Konya,_Turkey_-_UNESCO_World_Heritage_Site,_08.jpg",
  },
  'place:lidya': {
    image: require('../../assets/photos/place-lidya.jpg'),
    author: "Carole Raddato from FRANKFURT, Germany",
    license: "CC BY-SA 2.0",
    url: "https://commons.wikimedia.org/wiki/File:The_Bath-Gymnasium_complex_at_Sardis,_late_2nd_-_early_3rd_century_AD,_Sardis,_Turkey_(17098680002).jpg",
  },
  'place:likya': {
    image: require('../../assets/photos/place-likya.jpg'),
    author: "Ingo Mehling",
    license: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:Myra_theatre.jpg",
  },
  'place:mezopotamya': {
    image: require('../../assets/photos/place-mezopotamya.jpg'),
    author: "Omer Unlu",
    license: "CC BY 2.0",
    url: "https://commons.wikimedia.org/wiki/File:Hasankeyf_Castle.jpg",
  },
  'place:pamfilya': {
    image: require('../../assets/photos/place-pamfilya.jpg'),
    author: "Dosseman",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Aspendos_Basilica_4728.jpg",
  },
  'place:trakya': {
    image: require('../../assets/photos/place-trakya.jpg'),
    author: "Adli Wahid",
    license: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:Hagia_Sophia_(228968325).jpeg",
  },
  'place:troas': {
    image: require('../../assets/photos/place-troas.jpg'),
    author: "Adam Jones from Kelowna, BC, Canada",
    license: "CC BY-SA 2.0",
    url: "https://commons.wikimedia.org/wiki/File:Acropolis_-_Bergama_(Pergamon)_-_Turkey_-_10_(5747249729).jpg",
  },
  'place:urartu': {
    image: require('../../assets/photos/place-urartu.jpg'),
    author: "Bjørn Christian Tørrissen",
    license: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:Van_Fortress_From_Northwest.JPG",
  },
};
