import os
import json
import gzip
import sys

try:
    from Crypto.Cipher import AES
    from Crypto.Protocol.KDF import PBKDF2
    from Crypto.Hash import SHA1
    from Crypto.Random import get_random_bytes
except ImportError:
    print("Error: 'pycryptodome' package is required.")
    print("Please install it by running: pip install pycryptodome")
    sys.exit(1)

# The password for Yakuza Rogue: Yokohama massage parlor chapter / Dojo NTR save files
PASSWORD = "wanzg!1f**k"

def decrypt_es3(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        return None

    with open(file_path, "rb") as f:
        data = f.read()

    if len(data) < 16:
        print("Error: Invalid ES3 file (too short).")
        return None

    iv = data[:16]
    encrypted_data = data[16:]

    # Key derivation using PBKDF2 (SHA1, 100 iterations, 16 bytes key length)
    key = PBKDF2(PASSWORD.encode("utf-8"), iv, dkLen=16, count=100, hmac_hash_module=SHA1)
    
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted = cipher.decrypt(encrypted_data)

    # Remove PKCS7 padding
    padding_len = decrypted[-1]
    if 0 < padding_len <= 16:
        decrypted = decrypted[:-padding_len]

    # Check if data is gzipped
    is_gzipped = decrypted[0] == 0x1F and decrypted[1] == 0x8B
    if is_gzipped:
        try:
            decrypted = gzip.decompress(decrypted)
        except Exception as e:
            print("Warning: Failed to decompress gzipped data, returning raw decrypted data.", e)

    return decrypted.decode("utf-8", errors="ignore"), is_gzipped

def encrypt_es3(text_data, out_path, use_gzip=False):
    data = text_data.encode("utf-8")
    if use_gzip:
        data = gzip.compress(data)

    # PKCS7 Padding
    padding_len = 16 - (len(data) % 16)
    data += bytes([padding_len] * padding_len)

    iv = get_random_bytes(16)
    key = PBKDF2(PASSWORD.encode("utf-8"), iv, dkLen=16, count=100, hmac_hash_module=SHA1)

    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted = cipher.encrypt(data)

    with open(out_path, "wb") as f:
        f.write(iv + encrypted)

def main():
    print("=" * 60)
    print(" YAKUZA ROGUE: YOKOHAMA MASSAGE PARLOR SAVE GAME EDITOR ")
    print("=" * 60)

    # Search for save file in default locations
    local_appdata = os.getenv("LOCALAPPDATA", "")
    default_dirs = [
        os.path.join(local_appdata + "Low", "Yakuza Rogue_ Yokohama massage parlor chapter", "SaveGames"),
        r"D:\SteamLibrary\steamapps\common\Massage Parlor\MassageShop_Data\game_data",
        r"C:\Program Files (x86)\Steam\steamapps\common\Massage Parlor\MassageShop_Data\game_data"
    ]
    
    save_path = None
    saves_found = []
    
    for d in default_dirs:
        if os.path.exists(d):
            saves = [os.path.join(d, f) for f in os.listdir(d) if f.endswith(".es3")]
            saves_found.extend(saves)
            
    if saves_found:
        print("\nFound save games:")
        for idx, s in enumerate(saves_found):
            print(f" [{idx + 1}] {s}")
        print(" [M] Manual path entry")
        
        choice = input("\nSelect a save file to edit: ").strip()
        if choice.lower() == 'm':
            save_path = input("Enter full path to save file (.es3): ").strip().strip('"')
        else:
            try:
                idx = int(choice) - 1
                if 0 <= idx < len(saves_found):
                    save_path = saves_found[idx]
                else:
                    print("Invalid choice.")
                    return
            except ValueError:
                print("Invalid choice.")
                return
    else:
        save_path = input("\nNo saves found automatically. Enter full path to save file (.es3): ").strip().strip('"')

    if not save_path or not os.path.exists(save_path):
        print("Invalid file path.")
        return

    # Backup original file
    backup_path = save_path + ".bak"
    if not os.path.exists(backup_path):
        import shutil
        shutil.copy2(save_path, backup_path)
        print(f"\n[+] Created backup of original save file at: {backup_path}")

    # Decrypt
    print("\nDecrypting save file...")
    decrypted_str, was_gzipped = decrypt_es3(save_path)
    if not decrypted_str:
        print("[-] Decryption failed. Please make sure the file is valid.")
        return

    try:
        save_json = json.loads(decrypted_str)
    except json.JSONDecodeError:
        print("[-] Decrypted content is not valid JSON. Save file might be corrupted or using a different password.")
        print(decrypted_str[:100])
        return

    print("[+] Decrypted successfully!")
    
    # Edit values
    modified = False
    
    # Check for known variables (Money, etc.)
    # In Yakuza Rogue / Dojo NTR, Money is often stored inside a specific JSON structure.
    # Let's inspect keys
    print("\n--- Save File Keys ---")
    keys_list = list(save_json.keys())
    for k in keys_list[:15]:
        val = save_json[k]
        print(f" - {k}: {val}")
    if len(keys_list) > 15:
        print(f" ... and {len(keys_list) - 15} more keys.")
        
    print("\n=== Editing Menu ===")
    print(" [1] Set Money to 9,999,999")
    print(" [2] Set task_fail_count to 0 (Reset mission failures)")
    print(" [3] Custom JSON Modification (advanced)")
    print(" [4] Just Export Decrypted JSON to text file")
    
    menu_choice = input("\nChoose an option: ").strip()
    
    if menu_choice == "1":
        # Search for money keys
        money_keys = [k for k in save_json if "money" in k.lower() or "gold" in k.lower() or "cash" in k.lower()]
        if money_keys:
            for k in money_keys:
                print(f"Changing {k} from {save_json[k]} to 9999999")
                save_json[k] = 9999999
            modified = True
        else:
            # Let's prompt user to input key
            key = input("Money key not found automatically. Enter key name (e.g. 'store_money' or 'money'): ").strip()
            if key in save_json:
                save_json[key] = 9999999
                modified = True
            else:
                print(f"Key '{key}' not found in save.")
                
    elif menu_choice == "2":
        fail_keys = [k for k in save_json if "fail" in k.lower()]
        if fail_keys:
            for k in fail_keys:
                print(f"Changing {k} from {save_json[k]} to 0")
                save_json[k] = 0
            modified = True
        else:
            key = input("Failure key not found automatically. Enter key name (e.g. 'task_fail_count'): ").strip()
            if key in save_json:
                save_json[key] = 0
                modified = True
            else:
                print(f"Key '{key}' not found in save.")
                
    elif menu_choice == "3":
        key = input("Enter the key name to modify: ").strip()
        if key in save_json:
            print(f"Current value: {save_json[key]} (type: {type(save_json[key])})")
            new_val = input("Enter new value: ").strip()
            # Try to convert to int/float/bool if possible
            if new_val.lower() == 'true':
                new_val = True
            elif new_val.lower() == 'false':
                new_val = False
            else:
                try:
                    if '.' in new_val:
                        new_val = float(new_val)
                    else:
                        new_val = int(new_val)
                except ValueError:
                    pass # Keep as string
            save_json[key] = new_val
            modified = True
        else:
            print(f"Key '{key}' not found.")
            
    elif menu_choice == "4":
        txt_path = save_path + "_decrypted.json"
        with open(txt_path, "w", encoding="utf-8") as f:
            json.dump(save_json, f, indent=4)
        print(f"[+] Decrypted JSON exported to: {txt_path}")
        print("You can edit this file manually and then run this script again to re-encrypt it.")
        return

    if modified:
        print("\nRe-encrypting and saving file...")
        new_text = json.dumps(save_json)
        encrypt_es3(new_text, save_path, use_gzip=was_gzipped)
        print("[+] Save file updated successfully! Enjoy!")

if __name__ == "__main__":
    main()
