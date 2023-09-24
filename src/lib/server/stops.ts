// In Secondi
// Brin -> Brignole 0, 240, 360, 450, 540, 660, 750, 900
// Brignole -> Brin 0, 150, 240, 360, 450, 540, 660, 900

export default {
    brin: {
        name: "Brin (Certosa)",
        disc: { delay: 900, terminus: false, dest: "Brin (Certosa)" },
        asc: { delay: 0, terminus: true, dest: "Brignole" },
        nearBusStops: [
            {
                id: 137,
                exclude: [
                    "270", "670", "270/", "670/"
                ]
            },
            {
                id: 169,
                exclude: [
                    "270", "670", "270/", "670/"
                ]
            },
            3136,
        ],
    }, dinegro: {
        name: "Dinegro",
        disc: { delay: 750, terminus: false, dest: "Brin (Certosa)" },
        asc: { delay: 150, terminus: false, dest: "Brignole" },
        nearBusStops: [
            8, 91
        ],
    },
    principe: {
        name: "Principe",
        disc: { delay: 660, terminus: false, dest: "Brin (Certosa)" },
        asc: { delay: 240, terminus: false, dest: "Brignole" },
        nearBusStops: [
            568, 112, 1534, 451, 543, 2523, 452,
            {
                id: 433,
                exclude: [
                    "36", "36/",
                ]
            },
        ],
    },
    darsena: {
        name: "Darsena",
        disc: { delay: 540, terminus: false, dest: "Brin (Certosa)" },
        asc: { delay: 360, terminus: false, dest: "Brignole" },
        nearBusStops: [
            3, 93
        ],
    },
    sangiorgio: {
        name: "San Giorgio",
        disc: { delay: 450, terminus: false, dest: "Brin (Certosa)" },
        asc: { delay: 450, terminus: false, dest: "Brignole" },
        nearBusStops: [
            207, 170, 1, 4101
        ],
    },
    sarzano: {
        name: "Sarzano - Sant'Agostino",
        disc: { delay: 360, terminus: false, dest: "Brin (Certosa)" },
        asc: { delay: 540, terminus: false, dest: "Brignole" },
    },
    deferrari: {
        name: "De Ferrari",
        disc: { delay: 240, terminus: false, dest: "Brin (Certosa)" },
        asc: { delay: 660, terminus: false, dest: "Brignole" },
        nearBusStops: [
            2641, 2492
        ],
    },
    brignole: {
        name: "Brignole",
        disc: { delay: 0, terminus: true, dest: "Brin (Certosa)" },
        asc: { delay: 900, terminus: false, dest: "Brignole" },
        nearBusStops: [
            416, 1441, 439, 360, 116, 2353, 153, {
                id: 293,
                exclude: [
                    43, 47, 49, 16
                ]
            },
        ],
    }
} as Record<string, StationInfo>;