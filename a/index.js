import * as XLSX from "xlsx";


let result;
const uploadButton = document.getElementById("buttonUpload");
const input = document.getElementById("fileUpload");
const wrapper = document.getElementById("wrapper");
const sortButton = document.getElementById("sort");
const main = document.getElementById("main");
const chi_so_1 = document.getElementById("chi_so_1");
const chi_so_2 = document.getElementById("chi_so_2");
const chi_so_3 = document.getElementById("chi_so_3");
const chi_so_4 = document.getElementById("chi_so_4");
const loader = document.getElementById("wrapperLoader");


uploadButton.addEventListener("click", () => {
    input.click();
})

input.addEventListener("change", async (e) => {
    const selectedFile = e.target.files[0];
    console.log(e)
    const data = await readAsBinaryStringAsync(selectedFile);

    const workbook = XLSX.read(data, { type: "binary" });

    result = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    const fileName = document.getElementById("fileName");

    if (fileName) {
        fileName.remove();
    }

    const p = document.createElement("p");
    p.setAttribute("id", "fileName");
    p.insertAdjacentHTML('beforeend', selectedFile?.name ?? "");
    main.appendChild(p);
})

sortButton.addEventListener("click", () => {
    const c1 = chi_so_1.value;
    const c2 = chi_so_2.value;
    const c3 = chi_so_3.value;
    const c4 = chi_so_4.value;
    const table = document.getElementById("report");
    if (table) {
        table.remove();
    }
    loader.style.display = "flex";
    const tb = document.createElement("table");
    tb.setAttribute("id", "report");
    let content = "";
    let mapResult = result.map(item => {
        // tinh
        const x = (1 / item["Chi phí trên mỗi kết quả"]) * Number(c1)
            + (1 / item["Tần suất"]) * Number(c2)
            + (1 / item["CPM (Chi phí trên mỗi 1.000 lần hiển thị) (VND)"]) * Number(c3)
            + (1 / item["CPC (Tất cả) (VND)"]) * Number(c4)
        return {
            "Giá trị tối ưu": x,
            ...item,
        }
    }).sort((a, b) => b["Giá trị tối ưu"] - a["Giá trị tối ưu"]);
    //  header
    const keys = Object.keys(mapResult[0]);
    let header = "";
    keys.forEach(x => {
        header += `<th>${x}</th>`;
    });
    header = "<tr>" + header + "</tr>";
    content += header;

    // body
    mapResult.forEach(item => {
        let tr = "";
        Object.values(item).forEach(x => {
            tr += `<td>${x}</td>`;
        });
        tr = "<tr>" + tr + "</tr>";
        content += tr;
    })

    tb.insertAdjacentHTML('beforeend', content);

    setTimeout(() => {
        loader.style.display = "none";
        wrapper.appendChild(tb);
    }, 1000)

})

async function readAsBinaryStringAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsBinaryString(file);
    })
}