/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.ledui.app.postcard;

import android.os.Bundle;
import org.apache.cordova.*;
//import android.webkit.*;

public class main extends DroidGap {
	@Override
	public void onCreate(Bundle savedInstanceState) {

		
		super.onCreate(savedInstanceState);
		
	
		
		super.setStringProperty("loadingDialog", "程序启动中...");
		 //super.setIntegerProperty("splashscreen", R.drawable.splash); 
		// this.appView.addJavascriptInterface(this, "android"); 
	   //     this.appView.setInitialScale(0); 
		//super.setIntegerProperty("splashscreen", R.drawable.splash);
		//super.loadUrl("file:///android_asset/www/index.html");
		//super.loadUrl("file:///android_asset/www/index-jq.mobi.html");
		super.loadUrl("http://42.121.85.21/test/index.html");
		//super.loadUrl("http://m.taobao.com/");
		
		//super.loadUrl("file:///android_asset/www/backbutton.html");
	}
}
