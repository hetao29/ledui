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
/*
import android.app.Activity;
import android.webkit.WebChromeClient;
import android.view.WindowManager;
import com.phonegap.*;
*/
import android.os.Bundle;
import org.apache.cordova.*;
//import android.webkit.*;
/*
import android.view.*;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebSettings.ZoomDensity;
import 	java.lang.reflect.Field;
import android.view.inputmethod.EditorInfo;
*/
public class main extends DroidGap {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		
		//this.appView.getSettings().setSupportZoom( true ); //Modify this
		//this.appView.getSettings().setDefaultZoom(WebSettings.ZoomDensity.FAR);
		//super.setIntegerProperty("splashscreen", R.drawable.splash); 
		
		super.onCreate(savedInstanceState);
		
		/*全屏代码
		getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, 
                WindowManager.LayoutParams.FLAG_FULLSCREEN | 
                WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
        */
		super.loadUrl("file:///android_asset/www/index.html");
		//super.loadUrl("file:///android_asset/www/auto.html");
		//super.loadUrl("http://42.121.85.21/test/index.html");

		
		//appView.getSettings().setUseWideViewPort(true); 
		
		/*
		
		//this.appView.getSettings().setLoadWithOverviewMode(true);
		appView.getSettings().setSupportZoom(false);
		//this.appView.getSettings().setDefaultZoom(ZoomDensity.FAR);
		//this.appView.getSettings().setBuiltInZoomControls(true);
		appView.setInitialScale(0);
		*/
		appView.getSettings().setSupportZoom( false );
		//appView.getSettings().setUseWideViewPort(true); 
		appView.getSettings().setBuiltInZoomControls(false);
		appView.getSettings().setDisplayZoomControls(false);
		//appView.onCreateInputConnection(new EditorInfo(){
			/*
			@Override
			public boolean setComposingText(CharSequence text, int newCursorPosition) {
				return false;
			}*/
			//imeOptions IME_FLAG_NO_EXTRACT_UI;
			 //return new InputConnection(this, false);
		//});
		/*
		appView.setOnTouchListener(new View.OnTouchListener() { 
			@Override
			public boolean onTouch(View v, MotionEvent event) {
			           switch (event.getAction()) { 
			               case MotionEvent.ACTION_DOWN: 
			               case MotionEvent.ACTION_UP: 
			                   if (!v.hasFocus()) { 
			                       v.requestFocus(); 
			                   } 
			                   break; 
			           } 
			           return false; 
			        }
			});
		*/
		/*
		appView.setOnFocusChangeListener(new View.OnFocusChangeListener() {  
            @Override  
            public void onFocusChange(View v, boolean hasFocus) {  
                if(hasFocus)  
                {  
                    try {  
                        Field defaultScale = WebView.class.getDeclaredField("mDefaultScale");  
                        defaultScale.setAccessible(true);  
                        //WebViewSettingUtil.getInitScaleValue(VideoNavigationActivity.this, false )/100.0f 是我的程序的一个方法，可以用float 的scale替代  
                        defaultScale.setFloat(appView, 1);  
                    } catch (SecurityException e) {  
                        e.printStackTrace();  
                    } catch (IllegalArgumentException e) {  
                        e.printStackTrace();  
                    } catch (IllegalAccessException e) {  
                        e.printStackTrace();  
                    } catch (NoSuchFieldException e) {  
                        e.printStackTrace();  
                    }   
                }  
            }  
        });  
        */
		
		// this.appView.setInitialScale(0);
		
		 /*
		WebSettings ws = super.appView.getSettings();
		 
        ws.setSupportZoom(true);
        ws.setBuiltInZoomControls(true);
       
        ws.setBuiltInZoomControls(false);
        ws.setSupportZoom(false);
        ws.setDefaultZoom(ZoomDensity.FAR);
        */
	}
}
/*
 * ********
 * http://stackoverflow.com/questions/2083909/android-webview-refusing-user-input
 * 
 * 
 * 
 * http://developer.android.com/reference/android/webkit/WebSettings.html#setSupportZoom(boolean
 * 
 * 
 * http://forum.unity3d.com/threads/85722-With-Input.mousePosition-in-android-I-have-scale-problems
 * http://stackoverflow.com/questions/1752768/is-there-a-max-size-to-the-length-of-a-hidden-input-in-html
 * http://stackoverflow.com/questions/10330296/android-webview-use-setwideviewport-disable-double-tap-zoom-but-keep-pinch-zoom
 * http://jiapeng16.iteye.com/blog/1211449
 * http://stackoverflow.com/questions/3702805/is-there-a-way-to-disable-the-zoom-feature-on-input-fields-in-webview/7214199#7214199
 * http://www.dotblogs.com.tw/pou/archive/2010/09/26/17890.aspx
 **/
