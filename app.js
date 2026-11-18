
// ==========================================
// 1. MA'LUMOTLAR
// ==========================================

let guruhlar = JSON.parse(localStorage.getItem("guruhlar")) || [];

let davomat = JSON.parse(localStorage.getItem("davomat")) || {};


// ==========================================
// 2. HTML ELEMENTLAR
// ==========================================

let guruhNomi = document.querySelector("#guruhNomi");
let guruhQushish = document.querySelector("#guruhQushish");

let uquvchiIsmi = document.querySelector("#uquvchiIsmi");
let uquvchiGuruh = document.querySelector("#uquvchiGuruh");
let uquvchiQushish = document.querySelector("#uquvchiQushish");

let davomatGuruh = document.querySelector("#davomatGuruh");
let davomatSana = document.querySelector("#davomatSana");

let guruhlarRoyxati = document.querySelector("#guruhlarRoyxati");
let davomatRoyxati = document.querySelector("#davomatRoyxati");
let boshGuruhlar = document.querySelector("#boshGuruhlar");

let hisobotGuruh = document.querySelector("#hisobotGuruh");
let hisobotTuri = document.querySelector("#hisobotTuri");
let hisobotOy = document.querySelector("#hisobotOy");
let hisobotYil = document.querySelector("#hisobotYil");
let hisobotNatija = document.querySelector("#hisobotNatija");


// ==========================================
// 3. SANANI OLISH
// ==========================================

function sanaOl(sana) {

    let yil = sana.getFullYear();

    let oy = String(sana.getMonth() + 1).padStart(2, "0");

    let kun = String(sana.getDate()).padStart(2, "0");

    return `${yil}-${oy}-${kun}`;

}

let bugun = sanaOl(new Date());

document.querySelector("#bugungiSana").innerText = bugun;

davomatSana.value = bugun;

hisobotOy.value = bugun.slice(0, 7);

hisobotYil.value = new Date().getFullYear();


// ==========================================
// 4. MA'LUMOTLARNI SAQLASH
// ==========================================

function saqlash() {

    localStorage.setItem("guruhlar", JSON.stringify(guruhlar));

    localStorage.setItem("davomat", JSON.stringify(davomat));

}


// ==========================================
// 5. XAVFSIZ MATN
// ==========================================

function xavfsiz(matn) {

    return String(matn).replace(/[&<>"']/g, function (belgi) {

        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[belgi];

    });

}


// ==========================================
// 6. GURUH YARATISH
// ==========================================

guruhQushish.addEventListener("click", function () {

    let nom = guruhNomi.value.trim();

    if (nom === "") {

        alert("Guruh nomini kiriting!");

        return;

    }

    let mavjud = guruhlar.some(function (guruh) {

        return guruh.nomi.toLowerCase() === nom.toLowerCase();

    });

    if (mavjud) {

        alert("Bu guruh allaqachon mavjud!");

        return;

    }

    let yangiGuruh = {

        id: Date.now(),

        nomi: nom,

        uquvchilar: []

    };

    guruhlar.push(yangiGuruh);

    guruhNomi.value = "";

    saqlash();

    update();

    alert("Guruh muvaffaqiyatli yaratildi!");

});


// ==========================================
// 7. O'QUVCHI QO'SHISH
// ==========================================

uquvchiQushish.addEventListener("click", function () {

    let ism = uquvchiIsmi.value.trim();

    let guruhId = Number(uquvchiGuruh.value);

    if (ism === "") {

        alert("O'quvchi ismini kiriting!");

        return;

    }

    if (!guruhId) {

        alert("Guruhni tanlang!");

        return;

    }

    let guruh = guruhlar.find(function (guruh) {

        return guruh.id === guruhId;

    });

    if (!guruh) {

        alert("Guruh topilmadi!");

        return;

    }

    let mavjud = guruh.uquvchilar.some(function (uquvchi) {

        return uquvchi.ism.toLowerCase() === ism.toLowerCase();

    });

    if (mavjud) {

        alert("Bu o'quvchi ushbu guruhda mavjud!");

        return;

    }

    let yangiUquvchi = {

        id: Date.now(),

        ism: ism

    };

    guruh.uquvchilar.push(yangiUquvchi);

    uquvchiIsmi.value = "";

    saqlash();

    update();

    alert("O'quvchi muvaffaqiyatli qo'shildi!");

});


// ==========================================
// 8. SELECTLARNI YANGILASH
// ==========================================

function selectYangila() {

    let selectlar = [

        uquvchiGuruh,

        davomatGuruh,

        hisobotGuruh

    ];

    selectlar.forEach(function (select) {

        let eskiQiymat = select.value;

        select.innerHTML = '<option value="">Guruhni tanlang</option>';

        guruhlar.forEach(function (guruh) {

            let option = document.createElement("option");

            option.value = guruh.id;

            option.textContent = guruh.nomi;

            select.appendChild(option);

        });

        if (guruhlar.some(function (guruh) {

            return String(guruh.id) === eskiQiymat;

        })) {

            select.value = eskiQiymat;

        }

    });

}


// ==========================================
// 9. GURUHLARNI CHIQARISH
// ==========================================

function guruhlarniChiqar() {

    let matn = "";

    if (guruhlar.length === 0) {

        guruhlarRoyxati.innerHTML =
            '<p class="empty">Hozircha guruhlar yo‘q.</p>';

        boshGuruhlar.innerHTML =
            '<p class="empty">Hozircha guruhlar yo‘q.</p>';

        return;

    }

    guruhlar.forEach(function (guruh) {

        matn += `

            <div class="guruh-item">

                <div>

                    <strong>${xavfsiz(guruh.nomi)}</strong>

                    <p>${guruh.uquvchilar.length} ta o‘quvchi</p>

                </div>

                <button
                    class="uchirish"
                    data-guruh="${guruh.id}">

                    🗑 O‘chirish

                </button>

            </div>

            <div class="uquvchilar">

                ${guruh.uquvchilar.map(function (uquvchi) {

                    return `

                        <div class="uquvchi-item">

                            <span>${xavfsiz(uquvchi.ism)}</span>

                            <button
                                class="uchirish"
                                data-guruh="${guruh.id}"
                                data-uquvchi="${uquvchi.id}">

                                🗑

                            </button>

                        </div>

                    `;

                }).join("")}

            </div>

        `;

    });

    guruhlarRoyxati.innerHTML = matn;

    boshGuruhlar.innerHTML = matn;

}


// ==========================================
// 10. GURUH VA O'QUVCHINI O'CHIRISH
// ==========================================

guruhlarRoyxati.addEventListener("click", function (e) {

    let tugma = e.target.closest(".uchirish");

    if (!tugma) return;

    let guruhId = Number(tugma.dataset.guruh);

    let uquvchiId = Number(tugma.dataset.uquvchi);


    // O'QUVCHINI O'CHIRISH

    if (uquvchiId) {

        let tasdiq = confirm("O‘quvchini o‘chirmoqchimisiz?");

        if (!tasdiq) return;

        let guruh = guruhlar.find(function (guruh) {

            return guruh.id === guruhId;

        });

        if (!guruh) return;

        guruh.uquvchilar = guruh.uquvchilar.filter(function (uquvchi) {

            return uquvchi.id !== uquvchiId;

        });

        // O'quvchining davomat tarixini o'chirish

        Object.keys(davomat).forEach(function (sana) {

            if (davomat[sana][guruhId]) {

                delete davomat[sana][guruhId][uquvchiId];

                if (Object.keys(davomat[sana][guruhId]).length === 0) {

                    delete davomat[sana][guruhId];

                }

            }

            if (Object.keys(davomat[sana]).length === 0) {

                delete davomat[sana];

            }

        });

        saqlash();

        update();

        alert("O‘quvchi o‘chirildi!");

        return;

    }


    // GURUHNI O'CHIRISH

    let tasdiq = confirm(
        "Guruh va uning barcha o‘quvchilarini o‘chirmoqchimisiz?"
    );

    if (!tasdiq) return;

    guruhlar = guruhlar.filter(function (guruh) {

        return guruh.id !== guruhId;

    });

    // Guruhning barcha davomat tarixini o'chirish

    Object.keys(davomat).forEach(function (sana) {

        delete davomat[sana][guruhId];

        if (Object.keys(davomat[sana]).length === 0) {

            delete davomat[sana];

        }

    });

    saqlash();

    update();

    alert("Guruh o‘chirildi!");

});

function uchirishniBoshqar(e) {

    let tugma = e.target.closest(".uchirish");

    if (!tugma) return;

    let guruhId = Number(tugma.dataset.guruh);

    let uquvchiId = tugma.dataset.uquvchi
        ? Number(tugma.dataset.uquvchi)
        : null;

    let guruh = guruhlar.find(function (g) {
        return g.id === guruhId;
    });

    if (!guruh) {
        alert("Guruh topilmadi!");
        return;
    }

    // O'QUVCHINI O'CHIRISH

    if (uquvchiId !== null) {

        let tasdiq = confirm(
            guruh.uquvchilar.find(u => u.id === uquvchiId)?.ism +
            " o‘chirilsinmi?"
        );

        if (!tasdiq) return;

        guruh.uquvchilar = guruh.uquvchilar.filter(function (uquvchi) {
            return uquvchi.id !== uquvchiId;
        });

        Object.keys(davomat).forEach(function (sana) {

            if (davomat[sana][guruhId]) {
                delete davomat[sana][guruhId][uquvchiId];

                if (Object.keys(davomat[sana][guruhId]).length === 0) {
                    delete davomat[sana][guruhId];
                }
            }

            if (Object.keys(davomat[sana]).length === 0) {
                delete davomat[sana];
            }

        });

        saqlash();
        update();

        alert("O‘quvchi o‘chirildi!");

        return;
    }

    // GURUHNI O'CHIRISH

    if (!confirm(
        guruh.nomi + " guruhi va barcha o‘quvchilari o‘chirilsinmi?"
    )) return;

    guruhlar = guruhlar.filter(function (g) {
        return g.id !== guruhId;
    });

    Object.keys(davomat).forEach(function (sana) {

        delete davomat[sana][guruhId];

        if (Object.keys(davomat[sana]).length === 0) {
            delete davomat[sana];
        }

    });

    saqlash();
    update();

    alert("Guruh o‘chirildi!");

}


// IKKALA RO'YXATDA HAM ISHLAYDI

guruhlarRoyxati.addEventListener("click", uchirishniBoshqar);

boshGuruhlar.addEventListener("click", uchirishniBoshqar);


// ==========================================
// 11. DAVOMATNI SAQLASH
// ==========================================

function davomatniSaqlash(sana, guruhId, uquvchiId, holat) {

    if (!davomat[sana]) {

        davomat[sana] = {};

    }

    if (!davomat[sana][guruhId]) {

        davomat[sana][guruhId] = {};

    }

    davomat[sana][guruhId][uquvchiId] = holat;

    saqlash();

}


// ==========================================
// 12. DAVOMATNI CHIQARISH
// ==========================================

function davomatniChiqar() {

    let guruhId = Number(davomatGuruh.value);

    let sana = davomatSana.value;

    if (!guruhId || !sana) {

        davomatRoyxati.innerHTML =
            '<p class="empty">Guruh va sanani tanlang.</p>';

        statistikaYangila();

        return;

    }

    let guruh = guruhlar.find(function (guruh) {

        return guruh.id === guruhId;

    });

    if (!guruh) return;

    if (guruh.uquvchilar.length === 0) {

        davomatRoyxati.innerHTML =
            '<p class="empty">Bu guruhda o‘quvchilar yo‘q.</p>';

        statistikaYangila();

        return;

    }

    let matn = "";

    guruh.uquvchilar.forEach(function (uquvchi) {

        let holat =
            davomat[sana]?.[guruhId]?.[uquvchi.id] || "";

        matn += `

            <div class="student-item">

                <div class="student-name">

                    ${xavfsiz(uquvchi.ism)}

                </div>

                <div class="holatlar">

                    <button
                        class="${holat === "keldi" ? "active" : ""}"
                        data-id="${uquvchi.id}"
                        data-holat="keldi">

                        Keldi

                    </button>

                    <button
                        class="${holat === "kelmadi" ? "active" : ""}"
                        data-id="${uquvchi.id}"
                        data-holat="kelmadi">

                        Kelmadi

                    </button>

                    <button
                        class="${holat === "kechikdi" ? "active" : ""}"
                        data-id="${uquvchi.id}"
                        data-holat="kechikdi">

                        Kechikdi

                    </button>

                </div>

            </div>

        `;

    });

    davomatRoyxati.innerHTML = matn;

    statistikaYangila();

}


// ==========================================
// 13. DAVOMATNI BELGILASH
// ==========================================

davomatRoyxati.addEventListener("click", function (e) {

    let tugma = e.target.closest("button[data-holat]");

    if (!tugma) return;

    let uquvchiId = Number(tugma.dataset.id);

    let holat = tugma.dataset.holat;

    let guruhId = Number(davomatGuruh.value);

    let sana = davomatSana.value;

    if (!guruhId || !sana) return;

    davomatniSaqlash(
        sana,
        guruhId,
        uquvchiId,
        holat
    );

    davomatniChiqar();

    hisobotniChiqar();

});

davomatGuruh.addEventListener("change", davomatniChiqar);

davomatSana.addEventListener("change", davomatniChiqar);


// ==========================================
// 14. BUGUNGI STATISTIKA
// ==========================================

function statistikaYangila() {

    let jamiUquvchi = 0;

    let jamiKelgan = 0;

    let jamiKelmagan = 0;

    let bugungiDavomat = davomat[bugun] || {};

    guruhlar.forEach(function (guruh) {

        jamiUquvchi += guruh.uquvchilar.length;

        let guruhDavomat = bugungiDavomat[guruh.id] || {};

        guruh.uquvchilar.forEach(function (uquvchi) {

            let holat = guruhDavomat[uquvchi.id];

            if (holat === "keldi" || holat === "kechikdi") {

                jamiKelgan++;

            }

            if (holat === "kelmadi") {

                jamiKelmagan++;

            }

        });

    });

    document.querySelector("#jamiUquvchi").innerText = jamiUquvchi;

    document.querySelector("#jamiGuruh").innerText = guruhlar.length;

    document.querySelector("#kelganlar").innerText = jamiKelgan;

    document.querySelector("#kelmaganlar").innerText = jamiKelmagan;

}


// ==========================================
// 15. HISOBOTNI CHIQARISH
// ==========================================

function hisobotniChiqar() {

    let guruhId = Number(hisobotGuruh.value);

    let turi = hisobotTuri.value;

    let oy = hisobotOy.value;

    let yil = String(hisobotYil.value).trim();

    hisobotOy.disabled = turi === "yil";

    hisobotYil.disabled = turi === "oy";

    if (!guruhId) {

        hisobotNatija.innerHTML =
            '<p class="empty">Guruhni tanlang.</p>';

        return;

    }

    if (turi === "oy" && !oy) {

        hisobotNatija.innerHTML =
            '<p class="empty">Hisobot oyini tanlang.</p>';

        return;

    }

    if (turi === "yil" && !/^\d{4}$/.test(yil)) {

        hisobotNatija.innerHTML =
            '<p class="empty">Yilni to‘g‘ri kiriting.</p>';

        return;

    }

    let guruh = guruhlar.find(function (guruh) {

        return guruh.id === guruhId;

    });

    if (!guruh) return;

    let matn = "";

    guruh.uquvchilar.forEach(function (uquvchi) {

        let keldi = 0;

        let kelmadi = 0;

        let kechikdi = 0;

        let jami = 0;

        Object.keys(davomat).forEach(function (sana) {

            let mos = turi === "oy"
                ? sana.startsWith(oy)
                : sana.startsWith(yil);

            if (!mos) return;

            let holat =
                davomat[sana]?.[guruhId]?.[uquvchi.id];

            if (holat === "keldi") {

                keldi++;
                jami++;

            } else if (holat === "kelmadi") {

                kelmadi++;
                jami++;

            } else if (holat === "kechikdi") {

                kechikdi++;
                jami++;

            }

        });

        let foiz = jami > 0
            ? Math.round((keldi + kechikdi) / jami * 100)
            : 0;

        matn += `

            <div class="guruh-item">

                <div>

                    <strong>${xavfsiz(uquvchi.ism)}</strong>

                    <div class="hisobot-jami">

                        <span>Keldi: ${keldi}</span>

                        <span>Kelmadi: ${kelmadi}</span>

                        <span>Kechikdi: ${kechikdi}</span>

                    </div>

                    <p class="hisobot-foiz">
                        Davomat: ${foiz}%
                    </p>

                </div>

            </div>

        `;

    });

    if (guruh.uquvchilar.length === 0) {

        matn = '<p class="empty">Guruhda o‘quvchilar yo‘q.</p>';

    }

    hisobotNatija.innerHTML = matn;

}


// HISOBOT INPUTLARI

hisobotGuruh.addEventListener("change", hisobotniChiqar);

hisobotTuri.addEventListener("change", hisobotniChiqar);

hisobotOy.addEventListener("change", hisobotniChiqar);

hisobotYil.addEventListener("input", hisobotniChiqar);


// ==========================================
// 16. SAHIFALARNI ALMASHTIRISH
// ==========================================

let menyular = document.querySelectorAll(".menu");

menyular.forEach(function (tugma) {

    tugma.addEventListener("click", function () {

        menyular.forEach(function (menu) {

            menu.classList.remove("active");

        });

        tugma.classList.add("active");

        let sahifa = tugma.dataset.page;

        document.querySelectorAll(".page").forEach(function (page) {

            page.classList.add("hidden");

        });

        document.querySelector("#" + sahifa).classList.remove("hidden");

        let nomlar = {

            bosh: "Bosh sahifa",

            guruhlar: "Guruhlar",

            davomat: "Davomat",

            hisobot: "Hisobotlar"

        };

        document.querySelector("#sarlavha").innerText = nomlar[sahifa];

    });

});


// ==========================================
// 17. BARCHA MA'LUMOTLARNI YANGILASH
// ==========================================

function update() {

    selectYangila();

    guruhlarniChiqar();

    davomatniChiqar();

    statistikaYangila();

    hisobotniChiqar();

}


// ==========================================
// 18. SAYTNI ISHGA TUSHIRISH
// ==========================================

update();
