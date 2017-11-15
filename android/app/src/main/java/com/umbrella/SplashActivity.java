package com.umbrella;

import android.os.Bundle;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;

/**
 * Created by l on 13/11/2017.
 */

public class SplashActivity extends AppCompatActivity{
    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}
