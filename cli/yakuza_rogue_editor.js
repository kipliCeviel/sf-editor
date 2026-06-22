const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const readline = require('readline');

const PASSWORD = "wanzg!1f**k";

function preprocess_es3_json(jsonStr) {
    return jsonStr.replace(/([{,]\s*)([0-9]+)\s*:/g, '$1"$2":');
}

function postprocess_es3_json(jsonStr) {
    return jsonStr.replace(/([{,]\s*)"([0-9]+)"\s*:/g, '$1$2:');
}


function decrypt_es3(data, password) {
    try {
        const iv = data.subarray(0, 16);
        // Key derivation: pbkdf2 with sha1, 100 iterations, 16 bytes key size
        const key = crypto.pbkdf2Sync(password, iv, 100, 16, 'sha1');
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        
        let decrypted = Buffer.concat([decipher.update(data.subarray(16)), decipher.final()]);
        
        let wasGunzipped = false;
        // Check for gzip magic bytes 1F 8B
        if (decrypted[0] === 0x1F && decrypted[1] === 0x8B) {
            wasGunzipped = true;
            decrypted = zlib.gunzipSync(decrypted);
        }
        
        return { wasGunzipped, text: decrypted.toString('utf8'), success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

function encrypt_es3(textData, password, wasGunzipped) {
    let data = Buffer.from(textData, 'utf8');
    if (wasGunzipped) {
        data = zlib.gzipSync(data);
    }
    
    const iv = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, iv, 100, 16, 'sha1');
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return Buffer.concat([iv, encrypted]);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log("============================================================");
    console.log(" YAKUZA ROGUE: YOKOHAMA MASSAGE PARLOR SAVE GAME EDITOR ");
    console.log("============================================================");

    const localAppData = process.env.LOCALAPPDATA || "";
    const defaultDirs = [
        path.join(localAppData + "Low", "Yakuza Rogue_ Yokohama massage parlor chapter", "SaveGames"),
        "D:\\SteamLibrary\\steamapps\\common\\Massage Parlor\\MassageShop_Data\\game_data",
        "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Massage Parlor\\MassageShop_Data\\game_data"
    ];

    let savesFound = [];
    for (const d of defaultDirs) {
        if (fs.existsSync(d)) {
            const files = fs.readdirSync(d).filter(f => f.endsWith('.es3') && !f.toLowerCase().includes('index'));
            for (const f of files) {
                savesFound.push(path.join(d, f));
            }
        }
    }

    let savePath = "";
    const isAuto = process.argv.includes('--auto');

    if (savesFound.length > 0) {
        if (isAuto) {
            savePath = savesFound[0];
            console.log(`\n[Auto] Using automatically found save: ${savePath}`);
        } else {
            console.log("\nFound save games:");
            savesFound.forEach((s, idx) => {
                console.log(` [${idx + 1}] ${s}`);
            });
            console.log(" [M] Manual path entry");

            const choice = (await question("\nSelect a save file to edit: ")).trim();
            if (choice.toLowerCase() === 'm') {
                savePath = (await question("Enter full path to save file (.es3): ")).trim().replace(/^"|"$/g, '');
            } else {
                const idx = parseInt(choice) - 1;
                if (idx >= 0 && idx < savesFound.length) {
                    savePath = savesFound[idx];
                } else {
                    console.log("Invalid choice.");
                    rl.close();
                    return;
                }
            }
        }
    } else {
        if (isAuto) {
            console.log("[-] Auto mode failed: No save games found automatically.");
            rl.close();
            return;
        }
        savePath = (await question("\nNo saves found automatically. Enter full path to save file (.es3): ")).trim().replace(/^"|"$/g, '');
    }

    if (!savePath || !fs.existsSync(savePath)) {
        console.log("Invalid file path or file does not exist.");
        rl.close();
        return;
    }

    // Backup
    const backupPath = savePath + ".bak";
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(savePath, backupPath);
        console.log(`\n[+] Created backup of original save file at: ${backupPath}`);
    }

    // Read and decrypt
    console.log("\nDecrypting save file...");
    const rawData = fs.readFileSync(savePath);
    const decResult = decrypt_es3(rawData, PASSWORD);

    if (!decResult.success) {
        console.log(`[-] Decryption failed: ${decResult.error}`);
        rl.close();
        return;
    }

    let saveJSON;
    const cleanedText = preprocess_es3_json(decResult.text);
    try {
        saveJSON = JSON.parse(cleanedText);
    } catch (e) {
        console.log("[-] Decrypted content is not valid JSON. Save file might be corrupted or using a different password.");
        console.log(decResult.text.substring(0, 100));
        rl.close();
        return;
    }

    console.log("[+] Decrypted successfully!");

    let targetObj = saveJSON;
    if (saveJSON.key && typeof saveJSON.key.value === 'object' && saveJSON.key.value !== null) {
        targetObj = saveJSON.key.value;
    }

    // Show some keys
    console.log("\n--- Save File Keys & Values ---");
    const keys = Object.keys(targetObj);
    keys.slice(0, 15).forEach(k => {
        console.log(` - ${k}: ${JSON.stringify(targetObj[k])}`);
    });
    if (keys.length > 15) {
        console.log(` ... and ${keys.length - 15} more keys.`);
    }

    let menuChoice = "";
    let modified = false;

    if (isAuto) {
        console.log("\n[Auto] Modifying save data...");
        // Modify money
        const moneyKeys = keys.filter(k => /money|gold|cash|coin/i.test(k));
        moneyKeys.forEach(k => {
            console.log(`Changing ${k} from ${JSON.stringify(targetObj[k])} to 9999999`);
            targetObj[k] = 9999999;
        });
        
        // Modify fails
        const failKeys = keys.filter(k => /fail/i.test(k));
        failKeys.forEach(k => {
            console.log(`Changing ${k} from ${JSON.stringify(targetObj[k])} to 0`);
            targetObj[k] = 0;
        });
        modified = true;
    } else {
        console.log("\n=== Editing Menu ===");
        console.log(" [1] Set Money to 9,999,999");
        console.log(" [2] Set task_fail_count to 0 (Reset mission failures)");
        console.log(" [3] Custom JSON Modification (advanced)");
        console.log(" [4] Just Export Decrypted JSON to text file");

        menuChoice = (await question("\nChoose an option: ")).trim();

        if (menuChoice === "1") {
            const moneyKeys = keys.filter(k => /money|gold|cash|coin/i.test(k));
            if (moneyKeys.length > 0) {
                moneyKeys.forEach(k => {
                    console.log(`Changing ${k} from ${JSON.stringify(targetObj[k])} to 9999999`);
                    targetObj[k] = 9999999;
                });
                modified = true;
            } else {
                const customKey = (await question("Money key not found automatically. Enter key name (e.g. 'coin' or 'money'): ")).trim();
                if (customKey in targetObj) {
                    targetObj[customKey] = 9999999;
                    modified = true;
                } else {
                    console.log(`Key '${customKey}' not found in save.`);
                }
            }
        } else if (menuChoice === "2") {
            const failKeys = keys.filter(k => /fail/i.test(k));
            if (failKeys.length > 0) {
                failKeys.forEach(k => {
                    console.log(`Changing ${k} from ${JSON.stringify(targetObj[k])} to 0`);
                    targetObj[k] = 0;
                });
                modified = true;
            } else {
                const customKey = (await question("Failure key not found. Enter key name (e.g. 'task_fail_count'): ")).trim();
                if (customKey in targetObj) {
                    targetObj[customKey] = 0;
                    modified = true;
                } else {
                    console.log(`Key '${customKey}' not found.`);
                }
            }
        } else if (menuChoice === "3") {
            const customKey = (await question("Enter the key name to modify: ")).trim();
            if (customKey in targetObj) {
                console.log(`Current value: ${JSON.stringify(targetObj[customKey])} (type: ${typeof targetObj[customKey]})`);
                let newVal = (await question("Enter new value: ")).trim();
                
                if (newVal.toLowerCase() === 'true') newVal = true;
                else if (newVal.toLowerCase() === 'false') newVal = false;
                else if (!isNaN(newVal)) {
                    newVal = newVal.includes('.') ? parseFloat(newVal) : parseInt(newVal);
                }
                
                targetObj[customKey] = newVal;
                modified = true;
            } else {
                console.log(`Key '${customKey}' not found.`);
            }
        } else if (menuChoice === "4") {
            const txtPath = savePath + "_decrypted.json";
            fs.writeFileSync(txtPath, JSON.stringify(saveJSON, null, 4), 'utf8');
            console.log(`[+] Decrypted JSON exported to: ${txtPath}`);
            console.log("You can edit this file manually and then run this script again to re-encrypt it.");
        }
    }

    if (modified) {
        console.log("\nRe-encrypting and saving file...");
        const jsonStr = postprocess_es3_json(JSON.stringify(saveJSON));
        const newEncrypted = encrypt_es3(jsonStr, PASSWORD, decResult.wasGunzipped);
        fs.writeFileSync(savePath, newEncrypted);
        console.log("[+] Save file updated successfully! Enjoy!");
    }

    rl.close();
}

main();
