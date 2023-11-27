# Fms

此專案使用 [Angular CLI](https://github.com/angular/angular-cli) 版本 16.2.0 。

## 安裝 Angular CLI

在安裝之前，執行以下指令確認是否安裝了 Node.js。  
`node --version`  
執行以下指令透過 NPM 安裝 Angular CLI：  
`npm install --global @angular/cli`

### 檢查確認

安裝完成後，您可以使用以下指令檢查 Angular CLI 的版本：  
`ng --version`

## 執行 Angular 開發用 Server

使用以下指令啟動 Angular 開發伺服器：  
`ng serve`  
編譯完成後，您可以在瀏覽器中打開 http://localhost:4200/ 查看。

## 檔案結構

* `src`：開發中所有程式碼、資源全部都在這裡。
* `src/app`：包含整個網頁應用程式的 Module、Component、Service。
* `src/assets`：靜態資源資料夾。例如：圖片、多語系 json 檔等。
* `src/environments`：環境變數設定檔資料夾。

## Google Maps JavaScript API

相關的 Google Map API 引用，放在 `src/index.html` 中，如下：

* `Places and Directions libraries`：地點和方向功能。
* `Drawing library`：地圖上的繪圖圖層
