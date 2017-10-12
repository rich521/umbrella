package com.umbrella;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.content.Intent;

/**
 * Created by l on 12/10/2017.
 */

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this,MainActivity.class);
        startActivity(intent);
        finish();
    }
}
